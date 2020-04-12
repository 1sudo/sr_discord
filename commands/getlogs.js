const MessageAttachment = require('discord.js');

module.exports = {
	process: async (message, args) => {

		const attachment = new MessageAttachment('../MMOCoreORB/bin/log/admin/admin.log');

		return message.channel.send(`${message.author} has requested the admin logs, we're doomed!`, attachment);

	},
};