const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp'],
    description: 'Get avatar',
    usage: '{mention | no mention for self}',
    execute(args, message) {

        let member;
        if (args[0]) {
            member = message.mentions.users.first();
            if (!member) return message.reply('You need to specify a user');
            const embed = new MessageEmbed()
            .setTitle(`Avatar for ${member.tag}`)
            .setColor(0xff0000)
            .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));
        return message.channel.send(embed);
    }
        else {
             member = message.author;
             const embed = new MessageEmbed()
             .setTitle(`Avatar for ${member.tag}`)
             .setColor(0xff0000)
             .setImage(member.displayAvatarURL({ dynamic: true, size: 512 }));
        return message.channel.send(embed);
    }

    },
};