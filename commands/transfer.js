module.exports = {
    name: 'transfer',
    description: 'transfer',
    async execute(args, message) {
        const { currency } = require('../bot');
        const currentAmount = currency.getBalance(message.author.id);
        const transferTarget = message.mentions.users.first();
        const transferAmount = args[0];

        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, thats an invalid amount.`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, your only have ${currentAmount}.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zerom ${message.author}.`);

        currency.add(message.author.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred ${transferTarget.tag} to ${transferTarget.tag}. Your current balance is $${currency.getBalance(message.author.id)}`);
    },
};