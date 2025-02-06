const { SlashCommandBuilder } = require('discord.js');
// const Sequelize = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getscore')
		.setDescription('Gets the score of the specified user. Leave blank for your own score.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to retrieve the score for.')),
	async execute(interaction) {
		const target = interaction.options.getUser('user') ?? interaction.user;
		// db.run();
		await interaction.reply(`${target.displayName} has a score of 0`);
	},

};