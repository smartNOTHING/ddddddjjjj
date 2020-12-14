module.exports = {
    name: 'kick',
    description: 'kick',
    usage: '{mention} {reason}',
    args: true,
    admin: true,
    async execute(args, message) {

        const user = message.mentions.users.first();
        if (!user) return message.reply('Please use a proper mention');

        const reason = args[1] ? args.slice(1).join(' ') : 'No Reason Given';
        const member = message.guild.members.resolve(user);
        try {
            await member.kick(reason);
        }
        catch (e) {
            return message.channel.send(`Failed to kick **${user.tag}**: ${e}`);
        }
        return message.channel.send(`Successfully kicked **${user.tag}** for **${reason}**`);
    },
};