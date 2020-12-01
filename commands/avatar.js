module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp'],
    description: 'Get avatar',
    usage: '{mention | no mention for self}',
    execute(args, message) {

        const member = message.mentions.users.first();
        if (args[0]) {
            if (!member) return message.reply('You need to specify a user');
        return message.channel.send(`${member.username}'s avatar: ${member.displayAvatarURL({ dynamic: true })}`);
    }
    return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
    },
};