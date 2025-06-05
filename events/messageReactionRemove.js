const { Events } = require('discord.js');
const { Scoreboard, ReactionList } = require('../index.js');

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

		let reactionScore = null;
		const reactExists = await ReactionList.findOne({ where: { reaction_id: fullEmoji } });
		if (reactExists) {
			reactionScore = reactExists.score_worth;
		}

		if (reactionScore != null && !authorUser.bot) {

			if (authorUser.id === user.id && reactionScore > 0) reactionScore *= -1;

			await Scoreboard.destroy({ where: {
				message_id: reaction.message.id,
				user_id: user.id,
				reaction_id: reactExists.reaction_id,
			} });


		}
	},
};