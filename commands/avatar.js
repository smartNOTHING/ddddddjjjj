const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp'],
    description: 'Get avatar',
    usage: '{mention | no mention for self}',
    execute(args, message) {
        const member = message.mentions.users.first() || message.author;

        const embed = new MessageEmbed()
            .setTitle(`Avatar for ${member.tag}`)
            .setColor(0xff0000)
            .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));

        return message.channel.send(embed);
    },
};