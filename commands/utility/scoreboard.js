const { SlashCommandBuilder } = require('discord.js');
const { Scoreboard } = require('../../index.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription('Displays the current scoreboard for all users.'),
	async execute(interaction) {

		// TODO, makes this not shit. Maybe try using message components to make it look pretty? And some of this sequelize voodoo needs to go.

		const userCount = await Scoreboard.findAll({ group: ['message_user_id'], attributes: ['id', 'message_user_id'] });
		const userScores = await Scoreboard.count({ group: ['message_user_id', 'reaction_id'], attributes: ['id', 'message_user_id', 'reaction_id', 'score_worth'] });

		let finalScores = [];

		for (let i = 0; i < userCount.length; i++) {
			const curUser = userCount[i].message_user_id;
			const user = await interaction.client.users.fetch(userCount[i].message_user_id);

			let curScore = 0;
			for (let j = 0; j < userScores.length; j++) {
				if (userScores[j].message_user_id == curUser) {
					curScore += userScores[j].score_worth * userScores[j].count;
				}
			}

			const userScoreboard = [user.globalName || user.displayName, curScore];
			finalScores.push(userScoreboard);
		}

		finalScores = finalScores.sort((a, b) => b[1] - a[1]);

		let finalString = '';
		for (let i = 0; i < userCount.length; i++) {
			finalString = finalString + finalScores[i].join(': ') + '\n';
		}

		await interaction.reply(finalString || 'There is no scoreboard. (How did that happen?)');
	},

};