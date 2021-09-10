// AndyMacBottald / index.js
// Index file for AndyMacBottald
// Requires node.js, discord.js, and string-similarity (for sayline.js)

// Define constants and prefix for commands and token from config file
const Discord = require('discord.js');
const TMI = require('tmi.js');

const dclient = new Discord.Client();
const rclient = new Discord.Client();

const { prefix, dtoken, rtoken, BOT_NAME, TMI_OAUTH, channel } = require('./config.json');
const fs = require('fs');

const TMI_OPTIONS = {
	identity: {
	  username: BOT_NAME,
	  password: TMI_OAUTH
	},
	channels: [
	  channel
	]
  }

const tclient = new TMI.client(TMI_OPTIONS);

tclient.on('connected', onConnectedHandler);
tclient.connect();

dclient.commands = new Discord.Collection();
rclient.commands = new Discord.Collection();

// Read commands in from the names of .js files in /commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	dclient.commands.set(command.name, command);
	rclient.commands.set(command.name, command);
}

// Log in the console when discord bot up and running
dclient.once('ready', () => {
	console.log('Andy MacBottald, at your service.');
});
rclient.once('ready', () => {
	console.log('Roboremy coming in hot!');
});

// Log in the console when twitch bot up and running
function onConnectedHandler (addr, port) {
	console.log(`robojamie successfully connected to ${addr}:${port}`);
  }


// Handle reading messages and processing messages starting with the prefix (!)
dclient.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!dclient.commands.has(commandName)) return;

    const command = dclient.commands.get(commandName);

	try {
		command.execute(message, args, "bysb", null, null);
	} catch (error) {
		console.error(error);
		message.reply('Whoops, I was badly coded.');
	}
});

rclient.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!rclient.commands.has(commandName)) return;

    const command = rclient.commands.get(commandName);

	if (command === "randimg") {
		return;
	}

	try {
		command.execute(message, args, "rata", null, null);
	} catch (error) {
		console.error(error);
		message.reply('Whoops, I was badly coded.');
	}
});

tclient.on('message', (channel, tags, message, self) => {

	if(self || !message.startsWith(prefix)) return;

	const args = message.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	console.log("1");
	if (!dclient.commands.has(commandName)) return;
	console.log("2");
    const command = dclient.commands.get(commandName);

	console.log(command);
	console.log('4')
	command.execute(message, args, null, channel, tclient)
});

dclient.login(dtoken);
rclient.login(rtoken);
