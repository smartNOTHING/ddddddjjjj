const Discord = require('discord.js');
const client = new Discord.Client();
const Keyv = require('keyv');
const config = require('./config.json');
const fs = require('fs');
const auth = require('./auth.json');


const prefixes = new Keyv('sqlite://../database.sqlite');
const globalPrefix = config.prefix;

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	client.commands.set(command.name, command, command.description);
}

module.exports = { client, prefixes, globalPrefix, auth };