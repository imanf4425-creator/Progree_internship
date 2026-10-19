const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {
  initRedis,
  setUser,
  getUser,
  removeUser,
  getAllUsers,
  addUserToChannel,
  removeUserFromChannel,
  getChannelUsers
} = require('./redis-client');
const { logMessage, logEvent } = require('./logger');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

// Initialize Redis
initRedis().catch(console.error);

// Serve static HTML client
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WebSocket Chat</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
        #messages { border: 1px solid #ccc; height: 400px; overflow-y: scroll; padding: 10px; margin: 10px 0; }
        .message { margin: 5px 0; padding: 5px; }
        .system { color: #666; font-style: italic; }
        .user-message { color: #000; }
        input, select { padding: 8px; margin: 5px; }
        button { padding: 8px 15px; margin: 5px; cursor: pointer; }
        #userList { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>WebSocket Real-Time Chat</h1>
      
      <div id="login">
        <input type="text" id="username" placeholder="Enter username" />
        <button onclick="connect()">Connect</button>
      </div>
      
      <div id="chat" style="display:none;">
        <div>
          <select id="channel">
            <option value="general">General</option>
            <option value="random">Random</option>
            <option value="tech">Tech</option>
          </select>
          <button onclick="joinChannel()">Join Channel</button>
          <button onclick="disconnect()">Disconnect</button>
        </div>
        
        <div id="userList"></div>
        <div id="messages"></div>
        
        <div>
          <input type="text" id="messageInput" placeholder="Type message..." style="width: 600px;" />
          <button onclick="sendMessage()">Send</button>
        </div>
      </div>

      <script src="/socket.io/socket.io.js"></script>
      <script>
        let socket;
        let currentChannel = 'general';
        let currentUser = '';

        function connect() {
          currentUser = document.getElementById('username').value.trim();
          if (!currentUser) {
            alert('Please enter a username');
            return;
          }

          socket = io();

          socket.emit('join', { username: currentUser, channel: currentChannel });

          socket.on('user-joined', (data) => {
            addMessage(\`\${data.username} joined \${data.channel}\`, 'system');
            updateUserList(data.users);
          });

          socket.on('user-left', (data) => {
            addMessage(\`\${data.username} left \${data.channel}\`, 'system');
            updateUserList(data.users);
          });

          socket.on('message', (data) => {
            addMessage(\`\${data.username}: \${data.message}\`, 'user-message');
          });

          socket.on('channel-users', (users) => {
            updateUserList(users);
          });

          document.getElementById('login').style.display = 'none';
          document.getElementById('chat').style.display = 'block';
        }

        function disconnect() {
          if (socket) {
            socket.disconnect();
            document.getElementById('login').style.display = 'block';
            document.getElementById('chat').style.display = 'none';
            document.getElementById('messages').innerHTML = '';
          }
        }

        function joinChannel() {
          const newChannel = document.getElementById('channel').value;
          if (newChannel !== currentChannel) {
            socket.emit('leave-channel', { channel: currentChannel });
            socket.emit('join-channel', { channel: newChannel });
            currentChannel = newChannel;
            document.getElementById('messages').innerHTML = '';
            addMessage(\`Joined channel: \${newChannel}\`, 'system');
          }
        }

        function sendMessage() {
          const input = document.getElementById('messageInput');
          const message = input.value.trim();
          if (message && socket) {
            socket.emit('chat-message', { message, channel: currentChannel });
            input.value = '';
          }
        }

        function addMessage(text, className) {
          const messagesDiv = document.getElementById('messages');
          const msgDiv = document.createElement('div');
          msgDiv.className = 'message ' + className;
          msgDiv.textContent = text;
          messagesDiv.appendChild(msgDiv);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        function updateUserList(users) {
          const userListDiv = document.getElementById('userList');
          userListDiv.innerHTML = '<strong>Online Users (' + users.length + '):</strong> ' + 
            users.map(u => u.username).join(', ');
        }

        document.getElementById('messageInput').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') sendMessage();
        });
      </script>
    </body>
    </html>
  `);
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  logEvent('CONNECTION', { socketId: socket.id });

  socket.on('join', async (data) => {
    const { username, channel } = data;
    
    socket.username = username;
    socket.currentChannel = channel;
    
    await setUser(socket.id, { username, channel, socketId: socket.id });
    await addUserToChannel(channel, socket.id);
    
    socket.join(channel);
    
    const channelUsers = await getChannelUsers(channel);
    const users = await Promise.all(
      channelUsers.map(id => getUser(id))
    );
    
    io.to(channel).emit('user-joined', { username, channel, users });
    logEvent('USER_JOIN', { username, channel });
  });

  socket.on('join-channel', async (data) => {
    const { channel } = data;
    
    if (socket.currentChannel) {
      await removeUserFromChannel(socket.currentChannel, socket.id);
      socket.leave(socket.currentChannel);
    }
    
    socket.currentChannel = channel;
    await setUser(socket.id, { 
      username: socket.username, 
      channel, 
      socketId: socket.id 
    });
    await addUserToChannel(channel, socket.id);
    socket.join(channel);
    
    const channelUsers = await getChannelUsers(channel);
    const users = await Promise.all(
      channelUsers.map(id => getUser(id))
    );
    
    socket.emit('channel-users', users);
    io.to(channel).emit('user-joined', { 
      username: socket.username, 
      channel, 
      users 
    });
    
    logEvent('CHANNEL_JOIN', { username: socket.username, channel });
  });

  socket.on('leave-channel', async (data) => {
    const { channel } = data;
    
    await removeUserFromChannel(channel, socket.id);
    socket.leave(channel);
    
    const channelUsers = await getChannelUsers(channel);
    const users = await Promise.all(
      channelUsers.map(id => getUser(id))
    );
    
    io.to(channel).emit('user-left', { 
      username: socket.username, 
      channel, 
      users 
    });
    
    logEvent('CHANNEL_LEAVE', { username: socket.username, channel });
  });

  socket.on('chat-message', async (data) => {
    const { message, channel } = data;
    
    io.to(channel).emit('message', {
      username: socket.username,
      message,
      timestamp: new Date().toISOString()
    });
    
    logMessage('MESSAGE', channel, socket.username, message);
  });

  socket.on('disconnect', async () => {
    if (socket.currentChannel && socket.username) {
      await removeUserFromChannel(socket.currentChannel, socket.id);
      
      const channelUsers = await getChannelUsers(socket.currentChannel);
      const users = await Promise.all(
        channelUsers.map(id => getUser(id))
      );
      
      io.to(socket.currentChannel).emit('user-left', {
        username: socket.username,
        channel: socket.currentChannel,
        users
      });
      
      await removeUser(socket.id);
      logEvent('USER_DISCONNECT', { 
        username: socket.username, 
        channel: socket.currentChannel 
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`✓ WebSocket server running on port ${PORT}`);
  console.log(`✓ Open http://localhost:${PORT} in your browser`);
  logEvent('SERVER_START', { port: PORT });
});
