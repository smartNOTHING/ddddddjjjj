module.exports = {
    name: 'clear',
    args: true,
    usage: 'number of messages to delete',
    description: 'Clear',
    async execute(args, message) {
        const amount = args.join(' ');

        if (!amount) return message.reply('You have to specify an amount!');
        if (isNaN(amount)) return message.reply('Amount must be a number');

        if (amount > 100) return message.reply('You cant delete more than 100 messages at a time');
        if (amount < 1) return message.reply('You have to delete at least 1 message');

        await message.channel.messages.fetch({ limit: amount }).then (messages => {
            message.channel.bulkDelete(messages);
        });
    },
};