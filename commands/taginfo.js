const { Tags } = require('../dbObjects');
const { Op } = require('sequelize');

module.exports = {
    name: 'taginfo',
    description: 'taginfo',
    usage: '{tag}',
    async execute(args, message) {
        const tagName = args;

        const tag = await Tags.findOne({ where: { name: { [Op.like]: tagName } } });
        if (tag) {
            return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times`)
        }
        return message.reply(`Could not find tag: ${tagName}`);
      },
};