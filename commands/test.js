module.exports = {
    name: 'test',
    description: 'test',
    usage: '',
    execute(args, message) {
        message.channel.send(message);
    },
};