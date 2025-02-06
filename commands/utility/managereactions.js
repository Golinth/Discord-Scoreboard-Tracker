const { SlashCommandBuilder, MessageFlags } = require('discord.js');
// const sqlite3 = require('sqlite3');
// const db = new sqlite3.Database('scoreboard.db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('managereactions')
		.setDescription('Adds or Removes reactions to count for the scoreboard.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Adds a reaction that will count to the score')
				.addStringOption(option =>
					option.setName('reaction').setDescription('The reaction to add').setRequired(true))
				.addIntegerOption(option =>
					option.setName('score').setDescription('the score of the reaction').setRequired(true)),
		).addSubcommand(subcommand =>
			subcommand
				.setName('modify')
				.setDescription('modifies a reaction that counts to the score')
				.addStringOption(option =>
					option.setName('reaction').setDescription('The reaction to modify').setRequired(true))
				.addIntegerOption(option =>
					option.setName('score').setDescription('the score of the reaction').setRequired(true)),
		).addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('removes a reaction that counts to the score')
				.addStringOption(option =>
					option.setName('reaction').setDescription('The reaction to remove').setRequired(true))),

	async execute(interaction, user) {
		if (interaction.options.getSubCommand === 'add') {

			const react = interaction.options.getString('reaction');
			const score = interaction.options.getIntegere('score');

			// db.run();
			console.log(`${user} and ${react} and ${score} because I hate errors.`);

		} else if (interaction.options.getSubCommand === 'modify') {

			const react = interaction.options.getString('reaction');
			const score = interaction.options.getIntegere('score');

			// db.run();
			console.log(`${user} and ${react} and ${score} because I hate errors.`);
		} else if (interaction.options.getSubCommand === 'remove') {
			await interaction.reply({ content: 'WARNING! This will remove ALL points gained from the selected reaction. Are you sure you want to continue?', withResponse: true, flags: MessageFlags.Ephemeral });
			// const re = new RegExp('(?:^|\\W)(yes|y|ye|yup|confirm|accept)(?:$|\\W)');

			const react = interaction.options.getString('reaction');
			console.log(`${user} and ${react} and ${re} because I hate errors.`);
			// db.run();

		}
	},

};