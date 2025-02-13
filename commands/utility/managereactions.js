const { SlashCommandBuilder } = require('discord.js');
const { ReactionList } = require('../../index.js');
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

	async execute(interaction) {
		console.log('\nMR Interaction Started');
		if (interaction.options.getSubcommand() === 'add') {
			console.log('MR Add Interaction Started');

			const react = interaction.options.getString('reaction');
			const score = interaction.options.getInteger('score');
			console.log(`trying to add ${react} with score ${score}`);

			try {
				const newReact = await ReactionList.create({
					reaction_id: react,
					score_worth: score,
				});
				await newReact.save();
				await interaction.reply(`${react} now has a score of ${score}`);
			} catch {
				console.log(`Unable to add reaction ${react} to DB`);
				await interaction.reply(`Unable to add reaction ${react}. Has it been added already?`);
			}

		} else if (interaction.options.getSubcommand() === 'modify') {
			console.log('MR Modify Interaction Started');

			const react = interaction.options.getString('reaction');
			const score = interaction.options.getInteger('score');
			console.log(`trying to modify ${react} to score ${score}`);

			try {
				await ReactionList.update({ score_worth: score }, { where: { reaction_id: react } });
				await interaction.reply(`${react} now has a score of ${score}`);
			} catch {
				console.log(`Unable to modify reaction ${react}. Has it been added?`);
				await interaction.reply(`Unable to modfiy reaction ${react}. Has it been added?`);
			}

		} else if (interaction.options.getSubcommand() === 'remove') {
			console.log('MR Subtract Interaction Started');
			const react = interaction.options.getString('reaction');

			await ReactionList.destroy({
				where: {
				  reaction_id: react,
				},
			  });

			await interaction.reply(`${react} now has a score of 0`);
		}
		console.log('MR Interaction Ended\n');
	},

};