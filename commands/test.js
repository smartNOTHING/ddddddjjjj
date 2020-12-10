const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'test',
    description: 'test',
    usage: '',
    execute(args, message) {
        const embed = new MessageEmbed()
        .setTitle('test')
        .setImage(args[0] || 'https://www.reddit.com/r/funny/comments/k81sfk/a_photo_of_the_gingerbread_homewrecker/');
        message.channel.send(embed);
    },
};