require('dotenv').config();
const express = require('express');
const { connectQueue, consumeMessages } = require('../utils/message-queue');

const app = express();
const PORT = process.env.WORKER_PORT || 5003;

// Task processing logic
function processTask(message, acknowledge) {
  console.log('\n=== Processing Task ===');
  console.log('Type:', message.type);
  console.log('Payload:', JSON.stringify(message.payload, null, 2));
  console.log('Timestamp:', message.timestamp);

  // Simulate processing time
  setTimeout(() => {
    switch (message.type) {
      case 'DATA_CREATED':
        console.log(`✓ Processed DATA_CREATED: ${message.payload.content}`);
        break;
      
      case 'DATA_DELETED':
        console.log(`✓ Processed DATA_DELETED: ID ${message.payload.id}`);
        break;
      
      default:
        console.log(`✓ Processed generic task: ${message.type}`);
    }

    // Acknowledge message
    acknowledge();
    console.log('=== Task Completed ===\n');
  }, 1000);
}

// Initialize worker
async function startWorker() {
  console.log('🔧 Starting Worker Service...');
  
  await connectQueue();
  
  await consumeMessages(processTask);
  
  console.log('✓ Worker Service is ready and listening for tasks');
}

app.get('/', (req, res) => {
  res.json({
    service: 'Worker Service',
    status: 'Running',
    description: 'Processes async tasks from message queue'
  });
});

app.listen(PORT, () => {
  console.log(`✓ Worker Service running on port ${PORT}`);
  startWorker();
});
