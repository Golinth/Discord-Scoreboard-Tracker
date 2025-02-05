const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getscore')
		.setDescription('Gets the score of the specified user.'),
	async execute(interaction) {
		await interaction.reply('test!');
	},

};