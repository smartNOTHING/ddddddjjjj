const { Tags } = require('../dbObjects');

module.exports = {
    name: 'edittag',
    description: 'edittag',
    usage: '{existing tag} {new description}',
    async execute(args, message) {
    const tagName = args.shift();
    const tagDescription = args.join(' ');

    const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName}});
    if (affectedRows > 0) {
        return message.reply(`Tag ${tagName} was edited.`);
    }
    return message.reply(`Could not find a tag with name ${tagName}`);
  },
};