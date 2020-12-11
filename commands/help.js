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
        let page = 1;

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
            message.channel.send(embed).then(async (msg) => {
                msg.react('⬅️');
                msg.react('➡️');

                const forward = (reaction, user) => {
                    return reaction.emoji.name === '➡️' && user.id === message.author.id;
                };
                const backward = (reaction, user) => {
                    return reaction.emoji.name === '⬅️' && user.id === message.author.id;
                };

                const backwardcol = msg.createReactionCollector(backward, { time: 15000 });
                const forwardcol = msg.createReactionCollector(forward, { time: 15000 });

                backwardcol.on('collect', async () => {
                    page = page - 1;
                    if(page < 1) return page = page + 1;
                    const endback = page * multiple;
                    const startback = endback - multiple;

                    const comsback = array.slice(startback, endback);
                    const embedback = new Discord.MessageEmbed()
                    .setTitle('Help')
                    .setColor(0xff0000)
                    .setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

                    for(let i in comsback) {
                        let inline;
                        const name = `${prefix}${comsback[i][0].name}`;
                        const value = comsback[i][1].desc;
                        embedback.addFields(
                            { name, value, inline },
                        );
                    }

                    msg.edit(embedback);

                    const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                    try {
                        for(const reaction of userReactions.values()) {
                            await reaction.users.remove(message.author.id);
                        }
                    }
                        catch (error) {
                            console.error('Failed to remove reactions.');
                        }
                });
                forwardcol.on('collect', async () => {
                    page = page + 1;
                    if(page > maxPages) return page = page - 1;
                    const endnext = page * multiple;
                    const startnext = endnext - multiple;

                    const comsforward = array.slice(startnext, endnext);
                    const embednext = new Discord.MessageEmbed()
                    .setTitle('Help')
                    .setColor(0xff0000)
                    .setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

                    for(let i in comsforward) {
                        let inline;
                        const name = `${prefix}${comsforward[i][0].name}`;
                        const value = comsforward[i][1].desc;
                        embednext.addFields(
                            { name, value, inline },
                        );
                    }

                    msg.edit(embednext);

                    const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                    try {
                        for(const reaction of userReactions.values()) {
                            await reaction.users.remove(message.author.id);
                        }
                    }
                        catch (error) {
                            console.error('Failed to remove reactions.');
                        }

                });
            });
    },
};
