const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'chat-logs.txt');

function logMessage(type, channel, user, message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type}] [Channel: ${channel}] [User: ${user}] ${message}\n`;
  
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
  
  console.log(logEntry.trim());
}

function logEvent(event, details) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [EVENT] ${event}: ${JSON.stringify(details)}\n`;
  
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
  
  console.log(logEntry.trim());
}

module.exports = { logMessage, logEvent };
