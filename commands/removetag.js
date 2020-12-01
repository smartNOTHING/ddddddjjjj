const { Tags } = require('../dbObjects');

module.exports = {
    name: 'removetag',
    description: 'removetag',
    async execute(args, message) {
        const tagName = args;
        const rowCount = await Tags.destroy({ where: { name: tagName } });
        if (!rowCount) return message.reply('That tag did not exist.');

        return message.reply('Tag deleted.');
      },
};