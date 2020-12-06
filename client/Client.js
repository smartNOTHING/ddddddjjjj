const Discord = require('discord.js');
const client = new Discord.Client();
const Keyv = require('keyv');
const fs = require('fs');
client.auth = require('./auth.json');
client.config = require('./config.json');


client.prefixes = new Keyv('sqlite://../database.sqlite');
client.globalPrefix = client.config.prefix;

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	client.commands.set(command.name, command, command.description);
}

module.exports = { client };