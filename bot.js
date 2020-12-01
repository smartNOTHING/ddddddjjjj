const { client, prefixes, globalPrefix, auth } = require('./client/Client');
const { Users } = require('./dbObjects');
const { currency } = require('./models/Currency');
const Canvas = require('canvas');
const Discord = require('discord.js');

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

const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    let fontSize = 70;

    do {

        ctx.font = `${fontSize -= 10}px sans-serif`;

    } while (ctx.measureText(text).width > canvas.width - 300);

    return ctx.font;

};

client.on('guildMemberAdd', async (member) => {
    console.log('Hi');
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    if (!channel) return console.log('Not Found');

    const canvas = Canvas.createCanvas(700, 250);

    const ctx = canvas.getContext('2d');


    const background = await Canvas.loadImage('./canvas2.jpg');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

    ctx.font = applyText(canvas, member.displayName);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${member.displayName}!`, canvas.width / 2.4, canvas.height / 1.5);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-inage.png');

    channel.send(`Welcome to the server, ${member}!`, attachment);
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


client.login(auth.token);