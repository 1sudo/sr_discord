const getaccount = require('../commands/getaccount');
const getchars = require('../commands/getchars');
const gettrainer = require('../commands/gettrainer');
const getlogs = require('../commands/getlogs');
const verify = require('../commands/verify');

module.exports = {
	process: async (client, prefix, pool, footer, roles, channels) => {

		client.on('message', async message => {
			// Ignore other bots and makes your bot ignore itself so as not to loop and require prefix
			if (message.author.bot) return;
			if (message.content.indexOf(prefix) !== 0) return;

			const args = message.content.slice(prefix.length).split(' ');
			const command = args.shift(0).toLowerCase();

			/**
			 * ADMIN COMMANDS
			 */
			for (const [key, value] of Object.entries(roles.admin_roles)) {
				if (message.member.roles.cache.has(`${value}`)) {

					// Ensure the command can only be ran from the admin channel
					if (message.channel.id != channels.admin_channel) return;

					if (command === 'getaccount') {
						getaccount.process(message, args, pool, footer);
					}

					if (command === 'getchars') {
						getchars.process(message, args, pool, footer);
					}

					if (command === 'gettrainer') {
						gettrainer.process(message, args, pool, footer);
					}

					if (command === 'getlogs') {
						getlogs.process(message, args, pool);
					}

				}
			}

			/**
			 * STAFF COMMANDS
			 */
			for (const [key, value] of Object.entries(roles.staff_roles)) {
				if (message.member.roles.cache.has(`${value}`)) {

					// Ensure the command can only be ran from the staff channel
					if (message.channel.id != channels.staff_channel) return;

					// Commands here...
				}
			}

			/**
			 * VERIFIED USER COMMANDS
			 */
			if (message.member.roles.cache.has(roles.verified_role)) {

				// Ensure the command can only be ran from the verified channel
				if (message.channel.id != channels.verified_channel) return;

				// Commands here...
			}

			/**
			 * REGULAR USER COMMANDS
			 */
			if (command === 'verify') {
				verify.process(message, args, pool, footer, roles);
			}
		});
	},
};