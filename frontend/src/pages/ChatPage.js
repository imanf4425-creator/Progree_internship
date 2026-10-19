import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatPage.css';

const SOCKET_URL = 'http://localhost:4000';

function ChatPage() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState('general');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const channels = ['general', 'random', 'tech'];

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleConnect = () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    const newSocket = io(SOCKET_URL);
    
    newSocket.emit('join', { username, channel: currentChannel });

    newSocket.on('user-joined', (data) => {
      addSystemMessage(`${data.username} joined ${data.channel}`);
      setOnlineUsers(data.users);
    });

    newSocket.on('user-left', (data) => {
      addSystemMessage(`${data.username} left ${data.channel}`);
      setOnlineUsers(data.users);
    });

    newSocket.on('message', (data) => {
      addMessage(data.username, data.message);
    });

    newSocket.on('channel-users', (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setIsConnected(false);
    setMessages([]);
    setOnlineUsers([]);
  };

  const handleChannelChange = (channel) => {
    if (socket && channel !== currentChannel) {
      socket.emit('leave-channel', { channel: currentChannel });
      socket.emit('join-channel', { channel });
      setCurrentChannel(channel);
      setMessages([]);
      addSystemMessage(`Joined channel: ${channel}`);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !socket) return;

    socket.emit('chat-message', {
      message: messageInput,
      channel: currentChannel
    });

    setMessageInput('');
  };

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, { type: 'system', text }]);
  };

  const addMessage = (username, text) => {
    setMessages(prev => [...prev, { type: 'message', username, text }]);
  };

  if (!isConnected) {
    return (
      <div className="page-container">
        <div className="chat-login">
          <h1 className="page-title">Real-Time Chat</h1>
          <p className="page-subtitle">Task 3: WebSocket Communication</p>
          
          <div className="login-form">
            <div className="form-group">
              <label className="form-label">Enter your username</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleConnect}>
              Connect to Chat
            </button>
          </div>

          <div className="chat-info">
            <h3>Available Channels:</h3>
            <ul>
              <li>📢 General - Main discussion channel</li>
              <li>🎲 Random - Off-topic conversations</li>
              <li>💻 Tech - Technology discussions</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="chat-container">
        <div className="chat-header">
          <div>
            <h1 className="page-title">Chat Room</h1>
            <p className="chat-user">Logged in as: <strong>{username}</strong></p>
          </div>
          <button className="btn btn-danger" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>

        <div className="chat-channels">
          {channels.map(channel => (
            <button
              key={channel}
              className={`channel-btn ${channel === currentChannel ? 'active' : ''}`}
              onClick={() => handleChannelChange(channel)}
            >
              #{channel}
            </button>
          ))}
        </div>

        <div className="chat-layout">
          <div className="chat-main">
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="no-messages">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.type === 'system' ? 'system-message' : 'user-message'}`}
                  >
                    {msg.type === 'system' ? (
                      <span className="system-text">{msg.text}</span>
                    ) : (
                      <>
                        <span className="message-user">{msg.username}:</span>
                        <span className="message-text">{msg.text}</span>
                      </>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="message-input"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>

          <div className="chat-sidebar">
            <h3>Online Users ({onlineUsers.length})</h3>
            <ul className="user-list">
              {onlineUsers.map((user, index) => (
                <li key={index} className="user-item">
                  <span className="user-status">🟢</span>
                  {user.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
