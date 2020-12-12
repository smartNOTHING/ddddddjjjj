const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'test',
    description: 'test',
    usage: '',
    execute(args, message) {
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Notification')
            .setDescription(args.join(' '))
            .setFooter(message.guild, message.guild.iconURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp();
        message.channel.send(embed);
    },
};