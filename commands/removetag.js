const { Tags } = require('../dbObjects');

module.exports = {
    name: 'removetag',
    description: 'removetag',
    usage: '{tag to remove}',
    async execute(args, message) {
        const tagName = args;
        const tag = await Tags.findOne({ where: { name: tagName } });
        if (!message.member.hasPermission('ADMINISTRATOR')) {
        if (tag.username != message.author.username) {
          return message.reply('You dont the permissions to delete that tag');
        }
        else {
          const rowCount = await Tags.destroy({ where: { name: tagName } });
          if (!rowCount) return message.reply('That tag did not exist.');

          return message.reply('Tag deleted.');
        }
      }
        const rowCount = await Tags.destroy({ where: { name: tagName } });
        if (!rowCount) return message.reply('That tag did not exist.');

        return message.reply('Tag deleted.');
      },
};