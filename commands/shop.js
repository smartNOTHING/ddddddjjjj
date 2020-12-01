const { CurrencyShop } = require('../dbObjects');

module.exports = {
    name: 'shop',
    description: 'shop',
    usage: '',
    async execute(args, message) {
        const items = await CurrencyShop.findAll();
        return message.channel.send(items.map(item => `${item.name}: $${item.cost}`).join('\n'), { code: true });
    },
};