const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "help",
    description: "Displays this message",
    execute(args, message) {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        const embed = new Discord.MessageEmbed()
        .setTitle('Help')
        .setColor(0xff0000)

        for (const file of commandFiles) {
            const fileName = require(`./${file}`)
            embed.addField(fileName.name, fileName.description)
        }
      message.channel.send(embed)
    }
}