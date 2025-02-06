const { Events } = require('discord.js');
const Scoreboard = require('../index.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const scoreboard = new Scoreboard();
		scoreboard.syncronize();
		console.log(`Logged in as ${client.user.tag}`);
	},
};
