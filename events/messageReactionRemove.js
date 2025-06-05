const { Events } = require('discord.js');
const { Scoreboard, ReactionList } = require('../index.js');
const { clientId } = require('../config.json');

module.exports = {
	name: Events.MessageReactionRemove,
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

		let reactionCost = null;
		const reactExists = await ReactionList.findOne({ where: { reaction_id: fullEmoji } });
		if (reactExists) {
			reactionCost = reactExists.score_worth;
		}

		if (reactionCost != null) {
			const userExists = await Scoreboard.findOne({ where: { user_id: authorUser.id } });
			if (userExists) {
				if (userExists.user_id === clientId) return;
				if (authorUser.id === user.id && reactionCost > 0) reactionCost *= -1;

				const newScore = userExists.total_score - reactionCost;

				await Scoreboard.update({
					display_name: authorUser.displayName,
					total_score: newScore,
					total_reacts: userExists.total_reacts - 1 },
				{ where: { user_id: authorUser.id } });

			} else {
				const newUser = await Scoreboard.create({
					user_id: authorUser.id,
					display_name: authorUser.displayName,
					total_score: 0,
					total_reacts: 0,
				});
				await newUser.save();

				console.log(`Created new DB entry for ${newUser.username}.`);
			}
		}
	},
};