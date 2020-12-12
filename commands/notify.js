const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'notify',
    description: 'notify',
    usage: '',
    admin: true,
    execute(args, message) {
        if(!args.length) return message.reply('You need to specify a message');
        if(message.mentions.users.first()) return message.reply('You cannot mention a user in a notifcaiton');

        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Notification')
            .setDescription(args.join(' '))
            .setFooter(message.guild, message.guild.iconURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp();

        const server = message.guild.members.cache;
        server.forEach(member => {
            if(!member.user.bot) return member.user.send(embed);
        });
    },
};