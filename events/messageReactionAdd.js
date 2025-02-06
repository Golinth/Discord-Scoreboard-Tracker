const { Events } = require('discord.js');
const Scoreboard = require('../index.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, user, interaction) {
		const scoreboard = new Scoreboard();

		try {
			await reaction.fetch();
			    await reaction.message.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}

		const authorUser = reaction.message.author;
		const userExists = await scoreboard.findOne({ where: { username: authorUser.username } });

		if (userExists) {
			// const totalScore = totalScore + scoreboard.getTotalScore();
			// scoreboard.setTotalScore(totalScore);

			const tagName = interaction.options.getString('name');
			const tagDescription = interaction.options.getString('description');

			// equivalent to: UPDATE tags (description) values (?) WHERE name='?';
			const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });

			if (affectedRows > 0) {
				return interaction.reply(`${tagName} was edited.`);
			}


		} else {
			const newUser = await scoreboard.create({
				user_id: authorUser.id,
				username: authorUser.username,
				total_score: 0, // TODO
			});

			await interaction.reply(`${newUser.username} has recieved their first score!`);
		}

		console.log(`${user.username} has given reaction ${reaction.emoji} to ${authorUser.username}'s message ${reaction.message.content}.`);
		console.log(`New score for ${authorUser.username} is `);
	},
};