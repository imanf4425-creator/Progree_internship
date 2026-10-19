const redis = require('redis');

// Create Redis client (using in-memory fallback if Redis not available)
let client;
let isRedisAvailable = false;

// In-memory fallback store
const memoryStore = {
  users: new Map(),
  channels: new Map()
};

async function initRedis() {
  try {
    client = redis.createClient({
      socket: {
        host: 'localhost',
        port: 6379,
        connectTimeout: 5000
      }
    });

    client.on('error', (err) => {
      console.log('Redis error (using in-memory store):', err.message);
      isRedisAvailable = false;
    });

    await client.connect();
    isRedisAvailable = true;
    console.log('✓ Connected to Redis');
  } catch (error) {
    console.log('⚠ Redis not available, using in-memory store');
    isRedisAvailable = false;
  }
}

// User operations
async function setUser(userId, userData) {
  if (isRedisAvailable) {
    try {
      await client.hSet('users', userId, JSON.stringify(userData));
    } catch (error) {
      memoryStore.users.set(userId, userData);
    }
  } else {
    memoryStore.users.set(userId, userData);
  }
}

async function getUser(userId) {
  if (isRedisAvailable) {
    try {
      const data = await client.hGet('users', userId);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return memoryStore.users.get(userId) || null;
    }
  } else {
    return memoryStore.users.get(userId) || null;
  }
}

async function removeUser(userId) {
  if (isRedisAvailable) {
    try {
      await client.hDel('users', userId);
    } catch (error) {
      memoryStore.users.delete(userId);
    }
  } else {
    memoryStore.users.delete(userId);
  }
}

async function getAllUsers() {
  if (isRedisAvailable) {
    try {
      const users = await client.hGetAll('users');
      return Object.entries(users).map(([id, data]) => ({
        id,
        ...JSON.parse(data)
      }));
    } catch (error) {
      return Array.from(memoryStore.users.entries()).map(([id, data]) => ({
        id,
        ...data
      }));
    }
  } else {
    return Array.from(memoryStore.users.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }
}

// Channel operations
async function addUserToChannel(channel, userId) {
  if (isRedisAvailable) {
    try {
      await client.sAdd(`channel:${channel}`, userId);
    } catch (error) {
      if (!memoryStore.channels.has(channel)) {
        memoryStore.channels.set(channel, new Set());
      }
      memoryStore.channels.get(channel).add(userId);
    }
  } else {
    if (!memoryStore.channels.has(channel)) {
      memoryStore.channels.set(channel, new Set());
    }
    memoryStore.channels.get(channel).add(userId);
  }
}

async function removeUserFromChannel(channel, userId) {
  if (isRedisAvailable) {
    try {
      await client.sRem(`channel:${channel}`, userId);
    } catch (error) {
      if (memoryStore.channels.has(channel)) {
        memoryStore.channels.get(channel).delete(userId);
      }
    }
  } else {
    if (memoryStore.channels.has(channel)) {
      memoryStore.channels.get(channel).delete(userId);
    }
  }
}

async function getChannelUsers(channel) {
  if (isRedisAvailable) {
    try {
      return await client.sMembers(`channel:${channel}`);
    } catch (error) {
      return memoryStore.channels.has(channel) 
        ? Array.from(memoryStore.channels.get(channel))
        : [];
    }
  } else {
    return memoryStore.channels.has(channel) 
      ? Array.from(memoryStore.channels.get(channel))
      : [];
  }
}

module.exports = {
  initRedis,
  setUser,
  getUser,
  removeUser,
  getAllUsers,
  addUserToChannel,
  removeUserFromChannel,
  getChannelUsers
};
