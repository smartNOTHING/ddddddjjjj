const { Tags } = require('../dbObjects');

module.exports = {
    name: 'showtags',
    description: 'showtags',
    async execute(args, message) {
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
        return message.channel.send(`List of tags: ${tagString}`);
      },
};