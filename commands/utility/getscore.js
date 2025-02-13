const { SlashCommandBuilder } = require('discord.js');
const { Scoreboard } = require('../../index.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getscore')
		.setDescription('Gets the score of the specified user. Leave blank for your own score.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to retrieve the score for.')),
	async execute(interaction) {
		const target = interaction.options.getUser('user') ?? interaction.user;
		const targetUser = await Scoreboard.findOne({ where: { username: target.username } });
		if (targetUser) {
			const currentScore = targetUser.total_score;
			await interaction.reply(`${target.displayName} has a score of ${currentScore}.`);
		} else {
			await interaction.reply(`${target.displayName} has no score!`);
		}
	},

};