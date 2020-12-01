module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: '',
    execute(args, message) {
        message.channel.send('Pong!');
    },
};