const { Tags } = require('../dbObjects');

module.exports = {
    name: 'tag',
    description: 'tag',
    async execute(args, message) {
        const tagName = args;

        const tag = await Tags.findOne({ where: { name: tagName } });

        if (tag) {
            tag.increment('usage_count');
            return message.channel.send(tag.get('description'));
        }
        return message.reply(`Could not find tag: ${tagName}`);
      },
};