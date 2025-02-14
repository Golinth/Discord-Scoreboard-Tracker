const { Events } = require('discord.js');
const { Scoreboard, ReactionList } = require('../index.js');
const { clientId } = require('../config.json');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction, user) {

		try {
			await reaction.fetch();
			    await reaction.message.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}

		const authorUser = reaction.message.author;
		let fullEmoji = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
		if (reaction.emoji.id == null) {
			fullEmoji = reaction.emoji.name;
		}

		let reactionCost = 0;
		const reactExists = await ReactionList.findOne({ where: { reaction_id: fullEmoji } });
		if (reactExists) {
			reactionCost = reactExists.score_worth;
		}

		console.log(`${user.username} has given reaction ${reaction.emoji} to ${authorUser.username}'s message "${reaction.message.content}".`);

		if (reactionCost != 0) {
			const userExists = await Scoreboard.findOne({ where: { username: authorUser.username } });
			if (userExists) {
				if (authorUser.id == clientId) {
					return;
				}
				const currentScore = userExists.total_score;
				if (authorUser.username === user.username && reactionCost > 0) {
					reactionCost *= -1;
				}
				const newScore = reactionCost + currentScore;

				const affectedRows = await Scoreboard.update({ total_score: newScore }, { where: { username: authorUser.username } });
				await Scoreboard.update({ display_name: authorUser.displayName }, { where: { username: authorUser.username } });

				if (affectedRows > 0) {
					console.log(`${authorUser.username} now has ${newScore} points.`);
				}

			} else {
				const newUser = await Scoreboard.create({
					user_id: authorUser.id,
					username: authorUser.username,
					total_score: reactionCost,
					display_name: authorUser.displayName,
				});
				await newUser.save();

				console.log(`Created new DB entry for ${newUser.username}.`);
			}
		}
	},
};