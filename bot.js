const fs = require('fs');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const config = require('./config.json');
const prefix = config.prefix
const auth = require('./auth.json');
const { Users } = require('./dbObjects');
const currency = new Discord.Collection();
const Keyv = require('keyv');

let serverQueue;
const queue = new Map();
module.exports= {serverQueue, queue}




const client = new Discord.Client();
const prefixes = new Keyv('sqlite://database.sqlite')
const globalPrefix = config.prefix;
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command, command.description);
}

Reflect.defineProperty(currency, 'add', {
    value: async function add(id, amount) {
        const user = currency.get(id);
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }
        const newUser = await Users.create({ user_id: id, balance: amount });
        currency.set(id, newUser);
        return newUser;
    },
});

Reflect.defineProperty(currency, 'getBalance', {
    value: function getBalance(id) {
        const user = currency.get(id);
        return user ? user.balance : 0;
    },
});




client.once('ready', async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
    console.log('Ready!');
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'YOUUUUU',
            type: "PLAYING"
        }
    });
});

client.on('message', async message => {
    module.exports = { client , currency, prefixes }
    if(!message.guild  && !message.author.bot) {
        console.log(`${message.author.username}: ${message.content}`)
    }
    
    if (message.author.bot) return;
    currency.add(message.author.id, 1);

    let args;
    if (message.guild) {
        let prefix;

        if (message.content.startsWith(globalPrefix)) {
            prefix = globalPrefix;
        } else {
            const guildPrefix = await prefixes.get(message.guild.id);
            if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
        }

        if (!prefix) return;
        args = message.content.slice(prefix.length).trim().split(/\s+/);
    } else {
        const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
        args = message.content.slice(slice).split(/\s+/);
    }

    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    const serverQueue = "";

    

    if (command.args && !args.length) {
        let reply = `You didnt provide any arugments, ${message.author}`

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    } else
    
    try {
        command.execute(args, message, fs, fetch, globalPrefix);
        
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});



client.login(auth.token);