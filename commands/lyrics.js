const getSong = require('genius-lyrics-api/lib/getSong');
const Discord = require('discord.js');

module.exports = {
    name: 'lyrics',
    description: 'lyrics',
    usage: '',
    args: true,
    async execute(args, message) {
        if(!args.includes('-')) return message.reply('You must put the artist name first, and you must have a hyphon inbetween the artist and song name');
        const { client } = require('../bot');
        const TOKEN = client.auth.apikeys.geniusToken;
        const split = args.join(' ').split('-');
        const ARTIST = split[0];
        const TITLE = split[1];
        const PAGENUM = split[2];


        const options = {
            apiKey: TOKEN,
            title: TITLE,
            artist: ARTIST,
            optimizeQuery: true,
        };

        getSong(options).then((song) => {
            const multiple = 2048;
            let page = args.length && Number(PAGENUM) ? Number(PAGENUM) : 1;

            const end = page * multiple;
            const start = end - multiple;

            const lyrics = song.lyrics.slice(start, end);
            const maxPages = Math.ceil(song.lyrics.length / multiple);
            const embed = new Discord.MessageEmbed()
            .setTitle(`${args.join(' ')}`)
            .setDescription(lyrics)
            .setColor(0xff0000)
            .setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

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

                    const lyricsback = song.lyrics.slice(startback, endback);
                    const embedback = new Discord.MessageEmbed()
                    .setTitle(`${args.join(' ')}`)
                    .setDescription(lyricsback)
                    .setColor(0xff0000)
                    .setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

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

                    const lyricsnext = song.lyrics.slice(startnext, endnext);
                    const embednext = new Discord.MessageEmbed()
                    .setTitle(`${args.join(' ')}`)
                    .setDescription(lyricsnext)
                    .setColor(0xff0000)
                    .setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

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
        );
    },
};