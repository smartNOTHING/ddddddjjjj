module.exports = {
    name: "skip",
    description: "Skip music on YTDL",
    aliases: ["s"],
    async execute(args, message){
            const { serverQueue } = require('./play')
            if (!message.member.voice.channel)
              return message.channel.send(
                "You have to be in a voice channel to stop the music!"
              );
            if (!serverQueue)
              return message.channel.send("There is no song that I could skip!");
            serverQueue.connection.dispatcher.end();
          
    }
}