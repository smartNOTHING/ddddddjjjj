const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Displays this message',
    usage: '',
    execute(args, message) {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        const embed = new Discord.MessageEmbed()
        .setTitle('Help')
        .setColor(0xff0000);
    if (!args[0]) {
        for (const file of commandFiles) {
            const fileName = require(`./${file}`);
            if (!fileName.usage.length) {
            embed.addField(fileName.name, fileName.description);
            }
            else {embed.addField(fileName.name, fileName.usage);}
        }
    }
        else {
        for (const file of commandFiles) {
            const fileName = require(`./${file}`);
            if (args[0] == fileName.name) {
                if (!fileName.usage.length) {
            embed.addField(fileName.name, fileName.description);
                }
                else {embed.addField(fileName.name, fileName.usage);}
            }
        }
    }
      message.channel.send(embed);
    },
};