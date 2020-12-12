const { client } = require('./Client');
const { Manager } = require('erela.js');
const Spotify = require('erela.js-spotify');
const { MessageEmbed } = require('discord.js');

const clientID = client.auth.apikeys.spotifyID;
const clientSecret = client.auth.apikeys.spotifySecret;

client.manager = new Manager({
    nodes: [
        {
            host: 'localhost',
            port: 2333,
            password: 'youshallnotpass',
        },
    ],
    plugins: [
        new Spotify({
            clientID,
            clientSecret,
        }),
    ],
    autoPlay: true,
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
})
    .on('nodeConnect', node => console.log(`Node ${node.options.identifier} connected`))
    .on('nodeError', (node, error) => console.log(`Node ${node.options.identifier} has had an error ${error}`))
    .on('trackStart', (player, track) => {
        const guild = client.guilds.cache.get(player.guild);
        const req = guild.member(track.requester);
        const embed = new MessageEmbed()
            .setTitle('» Now Playing: ')
            .setDescription(`[${track.title}](${track.uri})`)
            .setAuthor(req.user.tag, req.user.displayAvatarURL())
            .setFooter(guild, guild.iconURL())
            .setTimestamp()
            .setThumbnail(track.thumbnail);
        if(track.uri !== 'https://www.youtube.com/watch?v=Q-tH0olciZU') {
        client.channels.cache.get(player.textChannel).send(embed).then(m => m.delete({ timeout: 10000 }));
    }
    else {return;}
    })
    .on('queueEnd', (player) => {
        client.channels.cache
            .get (player.textChannel)
            .send('Queue has ended.');

        player.destroy();
    })
    .on('playerMove', (player, currentChannel, newChannel) => {
        player.voiceChannel = client.channels.cache.get(newChannel);
    });

client.on('raw', (d) => client.manager.updateVoiceState(d));

module.exports = { client };