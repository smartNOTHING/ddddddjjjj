module.exports = {
    name: 'ban',
    description: 'ban',
    usage: '{mention} {reason}',
    args: true,
    admin: true,
    async execute(args, message) {
        const user = message.mentions.users.first();
        if(!user) return message.reply('Please use a proper mention');

        const reason = args[1] ? args.slice(1).join(' ') : 'No Reason Given';
        try {
            await message.guild.members.ban(user, { reason });
        }
        catch (e) {
            return message.channel.send(`Failed to ban **${user.tag}**: ${e}`);
        }
        return message.channel.send(`Successfully banned **${user.tag}** for **${reason}**`);
    },
};