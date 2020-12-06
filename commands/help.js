const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays this message',
    usage: '',
    async execute(args, message, prefix) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Help')
        .setColor(0xff0000);
        const { client } = require('../bot');
        const command = Array.from(client.commands);
        const array = [];

        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

        const end = page * multiple;
        const start = end - multiple;


            for(const i in command) {
                if(!command[i][1].usage.length) {
                    await array.push([{ name: command[i][1].name }, { desc: command[i][1].description }]);
                }
                else {
                    await array.push([{ name: command[i][1].name }, { desc: command[i][1].usage }]);
                }
            }
            const coms = array.slice(start, end);
            const maxPages = Math.ceil(array.length / multiple);
            if(!coms.length) return message.reply(`There is no page ${page}`);
            for(let i in coms) {
                let inline;
                const name = `${prefix}${coms[i][0].name}`;
                const value = coms[i][1].desc;
                embed.addFields(
                    { name, value, inline },
                );
                embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);
            }
            message.channel.send(embed);
    },
};
