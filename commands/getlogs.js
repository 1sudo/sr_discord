const { Discord, MessageAttachment } = require('discord.js');

module.exports = {
	process: (message, args) => {

		// Ensure the command can only be ran from the #admin channel
		if (message.channel.id !== '486820348654911528') {
			return;
		}

		const attachment = new MessageAttachment('../MMOCoreORB/bin/log/admin/admin.log');

		return message.channel.send(`${message.author} has requested the admin logs, we're doomed!`, attachment);

	},
};