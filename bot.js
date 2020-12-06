const { client, prefixes, globalPrefix, auth } = require('./client/Client');
const { applyImage } = require('./client/joinimage');
const { Users } = require('./dbObjects');
const { currency } = require('./models/Currency');
const { Manager } = require('erela.js');
const Spotify = require('erela.js-spotify');

const clientID = '59bd11b43b17467dabb20de917c717f2';
const clientSecret = 'bc28866ed8254af994743f18d88eaf15';

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
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
})
    .on('nodeConnect', node => console.log(`Node ${node.options.identifier} connected`))
    .on('nodeError', (node, error) => console.log(`Node ${node.options.identifier} has had an error ${error}`))
    .on('trackStart', (player, track) => {
        client.channels.cache
            .get(player.textChannel)
            .send(`Now playing: ${track.title}`);
    })
    .on('queueEnd', (player) => {
        client.channels.cache
            .get (player.textChannel)
            .send('Queue has ended.');

        player.destroy();
    });

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
    client.manager.init(client.user.id);
    const channel = client.channels.cache.find(ch => ch.name === 'bot-activity');
    if (!channel) return console.log('\nNo bot activity channel\n');
    channel.send('Im online!');
});

client.on('raw', (d) => client.manager.updateVoiceState(d));

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
    }

     try {
        command.execute(args, message, prefix, globalPrefix);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(auth.token);