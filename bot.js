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

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}



client.once('ready', () => {
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
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    

    const serverQueue = queue.get(message.guild.id);

    
    if (commandName == 'play' || commandName == 'p') {
        execute(message, serverQueue);
        return;
    } 

    else if (commandName == 'skip' || commandName == 's') {
        skip(message, serverQueue);
        return;
    } else if (commandName == 'stop' || commandName == 'st'){
        stop(message, serverQueue);
        return;
    } 
    else if (commandName == 'queue' || commandName == 'q') {
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


});

client.login(auth.token);