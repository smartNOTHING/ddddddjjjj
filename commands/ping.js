module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(args, message) {
        message.channel.send('Pong!');
    },
};