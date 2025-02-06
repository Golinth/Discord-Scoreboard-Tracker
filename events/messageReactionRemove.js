const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(reaction, user) {

		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				console.error('Something went wrong when fetching the message:', error);
				return;
			}
		}

		// Now the message has been cached and is fully available
		console.log(`${user.username} has removed reaction ${reaction.emoji} from ${reaction.message.author.username}'s message "${reaction.message.content}".`);
	},
};