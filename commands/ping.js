module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: '',
    execute(args, message) {
        message.channel.send(`Pong! Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms.`);
    },
};