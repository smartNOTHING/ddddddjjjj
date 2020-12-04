module.exports = {
    name: 'kick',
    description: 'kick',
    usage: '{mention} {reason}',
    args: true,
    admin: true,
    async execute(args, message) {
        const req = require('./getUserFromMention');
        const getUserFromMention = req.getUserFromMention;

        if (args.length < 2) {
            return message.reply('Please mention the user you want to kick and specify a reason');
        }

        const user = getUserFromMention(args[0]);
        if (!user) {
            return message.reply('Please use a proper mention');
        }

        const reason = args.slice(1).join(' ');
        const member = message.guild.members.resolve(user);
        try {
            await member.kick(reason);
        }
        catch (error) {
            return message.channel.send(`Failed to kick **${user.tag}**: ${error}`);
        }
        return message.channel.send(`Successfully kicked **${user.tag}** from the server!`);
    },
};