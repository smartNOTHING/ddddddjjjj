module.exports = {
    name: 'args-info',
    aliases: ['args'],
    description: 'args-info',
    args: true,
    execute(message, args) {
        if(args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};