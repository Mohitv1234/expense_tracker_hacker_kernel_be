// config/redis.config.js
const { createClient } = require('redis');

const client = createClient({
  url: 'redis://127.0.0.1:6379'
});

client.on('error', (err) => console.error('❌ Redis Error:', err));

module.exports = client;
