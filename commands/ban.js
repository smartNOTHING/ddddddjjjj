module.exports = {
    name: 'ban',
    description: 'ban',
    usage: '{mention} {reason}',
    args: true,
    admin: true,
    async execute(args, message) {
        const req = require('./getUserFromMention');
        const getUserFromMention = req.getUserFromMention;

        if (args.length < 2) {
            return message.reply('Please mention the user you want to ban and specify a reason');
        }

        const user = getUserFromMention(args[0]);
        if (!user) {
            return message.reply('Please use a proper mention');
        }

        const reason = args.slice(1).join(' ');
        try {
            await message.guild.members.ban(user, { reason });
        }
        catch (error) {
            return message.channel.send(`Failed to ban **${user.tag}**: ${error}`);
        }
        return message.channel.send(`Successfully banned **${user.tag}** from the server!`);
    },
};