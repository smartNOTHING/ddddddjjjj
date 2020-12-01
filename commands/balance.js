module.exports = {
    name: 'balance',
    description: 'balance',
    async execute(args, message) {
        const { currency } = require('../models/Currency');
            const target = message.mentions.users.first() || message.author;
            return message.channel.send(`${target.tag} has $${currency.getBalance(target.id)}`);
    },
};