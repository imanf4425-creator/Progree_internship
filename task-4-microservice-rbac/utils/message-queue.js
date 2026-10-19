const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const QUEUE_NAME = 'task_queue';

let channel = null;
let connection = null;
let isConnected = false;

// In-memory fallback queue
const memoryQueue = [];
const memoryConsumers = [];

async function connectQueue() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    isConnected = true;
    console.log('✓ Connected to RabbitMQ');
    return true;
  } catch (error) {
    console.log('⚠ RabbitMQ not available, using in-memory queue');
    isConnected = false;
    return false;
  }
}

async function publishMessage(message) {
  const messageStr = JSON.stringify(message);
  
  if (isConnected && channel) {
    try {
      channel.sendToQueue(QUEUE_NAME, Buffer.from(messageStr), {
        persistent: true
      });
      console.log('✓ Message published to RabbitMQ:', message.type);
      return true;
    } catch (error) {
      console.error('Error publishing to RabbitMQ:', error.message);
      // Fallback to memory
      memoryQueue.push(message);
      processMemoryQueue();
      return false;
    }
  } else {
    // Use in-memory queue
    memoryQueue.push(message);
    console.log('✓ Message added to in-memory queue:', message.type);
    processMemoryQueue();
    return true;
  }
}

async function consumeMessages(callback) {
  if (isConnected && channel) {
    try {
      console.log('✓ Waiting for messages in RabbitMQ...');
      
      channel.consume(QUEUE_NAME, (msg) => {
        if (msg !== null) {
          const content = JSON.parse(msg.content.toString());
          console.log('✓ Received message from RabbitMQ:', content.type);
          
          callback(content, () => {
            channel.ack(msg);
          });
        }
      });
      return true;
    } catch (error) {
      console.error('Error consuming from RabbitMQ:', error.message);
      memoryConsumers.push(callback);
      return false;
    }
  } else {
    // Use in-memory queue
    console.log('✓ Using in-memory queue consumer');
    memoryConsumers.push(callback);
    processMemoryQueue();
    return true;
  }
}

function processMemoryQueue() {
  if (memoryQueue.length > 0 && memoryConsumers.length > 0) {
    const message = memoryQueue.shift();
    memoryConsumers.forEach(consumer => {
      consumer(message, () => {
        console.log('✓ Message processed from in-memory queue');
      });
    });
  }
}

async function closeQueue() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('✓ Closed RabbitMQ connection');
  } catch (error) {
    console.error('Error closing RabbitMQ:', error.message);
  }
}

module.exports = {
  connectQueue,
  publishMessage,
  consumeMessages,
  closeQueue
};
