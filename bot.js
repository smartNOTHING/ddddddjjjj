const { client, prefixes, globalPrefix, auth } = require('./client/Client');
const { applyImage } = require('./client/joinimage');
const { Users } = require('./dbObjects');
const { currency } = require('./models/Currency');
const DisTube = require('distube');

client.distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true, leaveOnFinish: true });

client.once('ready', async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    console.log('Ready!');
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'YOUUUUU',
            type: 'PLAYING',
        },
    });
});


client.on('guildMemberAdd', async (member) => {
    applyImage(member);
    return;
});

client.on('message', async message => {
    if (message.author.bot) return;
    currency.add(message.author.id, 1);

    module.exports = { client, currency, prefixes };

    let args;
    let prefix;

    if (message.guild) {
        if (message.content.startsWith(globalPrefix)) {
            prefix = globalPrefix;
        }
        else {
            const guildPrefix = await prefixes.get(message.guild.id);
            if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
        }

        if (!prefix) return;
        args = message.content.slice(prefix.length).trim().split(/\s+/);
    }
    else {
        const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
        args = message.content.slice(slice).split(/\s+/);
    }


    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.admin && !message.member.hasPermission('ADMINISTRATOR')) {
        return message.reply('you dont have permission to use this command');
    }
    else if (command.args && !args.length) {
        let reply = `You didnt provide any arugments, ${message.author}`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    } try {
        command.execute(args, message, globalPrefix);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube
    .on('playSong', (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\` \nRequested by: ${song.user}`,
    ))
    .on('addSong', (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`,
    ))
    .on('playList', (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.title}\` playlist (${playlist.total_items} songs). \nRequested by: ${song.user}\nNow`,
    ))
    .on('addList', (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.title}\` playlist (${playlist.total_items} songs). to queue\n${status(queue)}`,
    ))
    .on('searchResult', (message, result) => {
        let i = 0;
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join('\n')}\n*Enter anything else or wait 60 seconds to cancel*`);
    })
    .on('searchCancel', (message) => message.channel.send('Searching Cancelled'))
    .on('error', (message, err) => message.channel.send(`An error has encountered: ${err}`));


client.login(auth.token);