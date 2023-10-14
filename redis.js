const redis = require('redis')

const client = redis.createClient();

client.on('connect', () => {
  console.log('Conectado ao servidor redis')
});

module.exports = client;