const { Tags } = require('../dbObjects');

module.exports = {
    name: "taginfo",
    description: "taginfo",
    async execute(args, message){
        const tagName = args;

        const tag = await Tags.findOne({where: {name: tagName}})
        if (tag){
            return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times`)
        }
        return message.reply(`Could not find tag: ${tagName}`)
      }
}