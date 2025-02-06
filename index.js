const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const { Sequelize, DataTypes, Model } = require('sequelize');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Reaction],
});


const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite',
});

// Create an accessable sql class
class Scoreboard extends Model {
	getId() {
		return this.id;
	}
	getUsername() {
		return this.username;
	}
	getTotalScore() {
		return this.total_score;
	}
	async syncronize() {
		await sequelize.sync();
		console.log('Scoreboard syncronized!');
	}
}
// Init the database
Scoreboard.init({
	user_id: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	username: {
		type: DataTypes.STRING,
	},
	total_score: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
}, {
	sequelize,
	modelName: 'Scoreboard',
});

module.exports = Scoreboard;

// Init the command variables
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Read the path to the command files
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require (filePath);

		// Is the command valid?
		if ('data' in command && 'execute' in command) {
			// Add the new command
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}

}

// Init the event variables
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Read the path to the event files
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	// Is this a one time event or one we are listening for?
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);