module.exports = {
    name: 'ping',
    descritption: 'Ping!',
    execute(message, args) {
        message.channel.send('Pong!');
    },
};