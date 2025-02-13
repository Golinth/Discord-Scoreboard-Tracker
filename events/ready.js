const { Events } = require('discord.js');
const { Scoreboard, ReactionList } = require('../index.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const scoreboard = new Scoreboard();
		const reactionList = new ReactionList();

		scoreboard.syncronize();
		reactionList.syncronize();

		console.log(`Logged in as ${client.user.tag}`);
	},
};
