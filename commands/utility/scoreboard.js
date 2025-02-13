const { SlashCommandBuilder } = require('discord.js');
const { Scoreboard } = require('../../index.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription('Displays the current scoreboard for all users.'),
	async execute(interaction) {

		const scoreboardAmount = await Scoreboard.count();
		let finalScoreboard = [];


		for (let i = 1; i <= scoreboardAmount; i++) {
			const curUser = await Scoreboard.findOne({ where: { id: i } });
			const curScore = [curUser.display_name, curUser.total_score];
			finalScoreboard.push(curScore);
		}
		finalScoreboard = finalScoreboard.sort((a, b) => b[1] - a[1]);

		let finalString = '';
		for (let i = 0; i < scoreboardAmount; i++) {
			finalString = finalString + finalScoreboard[i].join(': ') + '\n';
		}

		await interaction.reply(finalString);
	},

};