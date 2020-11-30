const fs = require('fs');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const urlLib = require('url');
const https = require('https');
const config = require('./config.json');
const prefix = config.prefix
const { cpuUsage } = require('process');
const { Http2ServerRequest } = require('http2');
const queue = new Map();
const auth = require('./auth.json');
const tldr = require('tldr')
const { Sequelize, Op } = require('sequelize');
const { Users, CurrencyShop } = require('./dbObjects');
const currency = new Discord.Collection();
const Keyv = require('keyv');



const client = new Discord.Client();
const prefixes = new Keyv('sqlite://database.sqlite')
const globalPrefix = config.prefix;
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command, command.description);
}




const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
    username: Sequelize.STRING,
    usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
})


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
    Tags.sync();
});

client.on('message', async message => {
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
    
    if (message.guild) {
    const serverQueue = queue.get(message.guild.id);
    }

    if (commandName == 'prefix') {
        if (args.length) {
            await prefixes.set(message.guild.id, args[0]);
            return message.channel.send(`Successfully set prefix to \`${args[0]}\``)
        }

        return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``)
    } else if (commandName == 'balance') {
        balance();
        return;
    } else if (commandName == 'inventory') {
        inventory();
        return;
    } else if (commandName == 'transfer') {
        transfer();
        return;
    } else if (commandName == 'buy') {
        buy();
        return;
    } else if (commandName == 'shop') {
        shop();
        return;
    } else if (commandName == 'leaderboard') {
        leaderboard();
        return;
    } else if (commandName == 'help'){
        help();
        return;
    } else if (commandName == 'addtag') {
        addTag();
        return;
    } else if (commandName === 'tag') {
        tag();
        return;
    } else if (commandName == 'edittag') {
        editTag();
        return;
    } else if (commandName == 'taginfo') {
        tagInfo();
        return;
    } else if (commandName == 'showtags') {
        showTags();
        return;
    } else if (commandName === 'removetag') {
        removeTag();
        return;
    } else if (commandName == 'play' || commandName == 'p') {
        execute(message, serverQueue);
        return;
    } else if (commandName == 'skip' || commandName == 's') {
        skip(message, serverQueue);
        return;
    } else if (commandName == 'stop' || commandName == 'st'){
        stop(message, serverQueue);
        return;
    } else if (commandName == 'queue' || commandName == 'q') {
        embed(message, serverQueue);
        return;
    }
     else if (command.args && !args.length) {
        let reply = `You didnt provide any arugments, ${message.author}`

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    } else
    
    try {
        command.execute(message, args, fs, fetch, client);
        
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

     
    /* FUNCTIONS */
    
    
    async  function execute(message, serverQueue) {
        
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) 
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );
        if (ytdl.validateURL(args[0])){
        const songInfo = await ytdl.getInfo(args[0]);
        song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        };
    } else {
        const {videos} = await yts(args.slice(0).join(" "));
        if (!videos.length) return message.channel.send("No songs were found!");
        song = {
            title: videos[0].title,
            url: videos[0].url,
            time: videos[0].duration.timestamp
        };
    };

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

        queue.set(message.guild.id, queueConstruct)

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`);
        };

        function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
              serverQueue.voiceChannel.leave();
              queue.delete(guild.id);
              return;
            }
          
            const dispatcher = serverQueue.connection
              .play(ytdl(song.url))
              .on("finish", () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
              })
              .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Now playing: **${song.title}**`);
          }
        }

    function skip(message, serverQueue) {
        if (!message.member.voice.channel)
          return message.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
        if (!serverQueue)
          return message.channel.send("There is no song that I could skip!");
        serverQueue.connection.dispatcher.end();
      }
      
      function stop(message, serverQueue) {
        if (!message.member.voice.channel)
          return message.channel.send(
            "You have to be in a voice channel to stop the music!"
          );
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
      }

      function embed(message, serverQueue) {
          const embed = new Discord.MessageEmbed()
          .setTitle('Queue')
          .setColor(0xff0000)
          
          for(var key in serverQueue.songs){
            embed.addField(serverQueue.songs[key]['title'], serverQueue.songs[key]['url'])
            embed.addField(serverQueue.songs[key]['time'], "--------------------------------------------------------")
          }
          message.channel.send(embed);
      }

      function help(){
            const embed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setColor(0xff0000)

            for (const file of commandFiles) {
                const fileName = require(`./commands/${file}`)
                embed.addField(fileName.name, fileName.description)
            }
          message.channel.send(embed)
      }

     async function addTag(){
        const tagName = args.shift();
        const tagDescription = args.join(' ');

        try {
            const tag = await Tags.create({
                name: tagName,
                description: tagDescription,
                username: message.author.username,
            });
            return message.reply(`Tag ${tag.name} added.`);
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That tag already exists');
            }
            return message.reply('Something went wrong with adding a tag');
        }
      }

      async function tag(){
        const tagName = args;

        const tag = await Tags.findOne({ where: {name: tagName }});

        if (tag) {
            tag.increment('usage_count');
            return message.channel.send(tag.get('description'));
        }
        return message.reply(`Could not find tag: ${tagName}`);
      }

      async function editTag(){
        const tagName = args.shift();
        const tagDescription = args.join(' ');

        const affectedRows = await Tags.update({ description: tagDescription}, { where: { name: tagName}});
        if (affectedRows > 0) {
            return message.reply(`Tag ${tagName} was edited.`)
        }
        return message.reply(`Could not find a tag with name ${tagName}`)
      }

      async function tagInfo(){
        const tagName = args;

        const tag = await Tags.findOne({where: {name: tagName}})
        if (tag){
            return message.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times`)
        }
        return message.reply(`Could not find tag: ${tagName}`)
      }

      async function showTags(){
        const tagList = await Tags.findAll({ attributes: ['name']});
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
        return message.channel.send(`List of tags: ${tagString}`);
      }

      async function removeTag(){
        const tagName = args;
        const rowCount = await Tags.destroy({ where: {name: tagName }});
        if (!rowCount) return message.reply('That tag did not exist.');

        return message.reply('Tag deleted.');
      }

      function balance(){
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(`${target.tag} has $${currency.getBalance(target.id)}`);
      }

      async function inventory(){
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: {user_id: target.id } });
        const items = await user.getItems();

        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
      }

      function transfer(){
        const currentAmount = currency.getBalance(message.author.id);
        const transferAmount = args.find(arg => !/<@?\d+>/g.test(arg));
        const transferTarget = message.mentions.user.first();

        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, thats an invalid amount.`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, your only have ${currentAmount}.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zerom ${message.author}.`);

        currency.add(message.author.id, -transferAmount)
        currency.add(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred $${transferTarget.tag} to ${transferTarget.tag}. Your current balance is $${currency.getBalance(message.author.id)}`);
      }

      async function buy(){
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args } } });
        if (!item) return message.channel.send(`That item doesn't exist.`);
        if (item.cost > currency.getBalance(message.author.id)) {
            return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
        }

        const user = await Users.findOne({ where: { user_id: message.author.id } });
        currency.add(message.author.id, -item.cost);
        await user.addItem(item);

        message.channel.send(`You've bought: ${item.name}.`);
      }

     async function shop(){
        const items = await CurrencyShop.findAll();
        return message.channel.send(items.map(item => `${item.name}: $${item.cost}`).join('\n'), {code: true });
      }

      function leaderboard(){
        return message.channel.send(
            currency.sort((a,b) => b.balance - a.balance)
                .filter(user => client.users.cache.has(user.user_id))
                .first(10)
                .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: $${user.balance}`)
                .join('\n'),
            { code: true }
        );
      }

});

client.login(auth.token);