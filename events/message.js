const fs = require('fs');

// Admin
// eslint-disable-next-line no-unused-vars
const getlogs = require('../commands/admin/getlogs');

// Staff
// eslint-disable-next-line no-unused-vars
const getaccount = require('../commands/staff/getaccount');
// eslint-disable-next-line no-unused-vars
const getchars = require('../commands/staff/getchars');

// Verified
// eslint-disable-next-line no-unused-vars
const gettrainer = require('../commands/verified/gettrainer');

// Unverified
// eslint-disable-next-line no-unused-vars
const verify = require('../commands/unverified/verify');

module.exports = {
	process: async (client, prefix, pool, footer, roles, channels) => {

		client.on('message', async message => {

			// Ignore other bots and makes your bot ignore itself so as not to loop and require prefix
			if (message.author.bot) return;
			if (message.content.indexOf(prefix) !== 0) return;

			// Get command and arguments
			const args = message.content.slice(prefix.length).split(' ');
			const command = args.shift(0).toLowerCase();

			/**
			 * ADMIN COMMANDS
			 */
			const adminFiles = fs.readdirSync('commands/admin').filter(file => file.endsWith('.js'));

			adminFiles.forEach((tFile) => {
				const adminCommandFileName = tFile.split('.');
				const adminCommandName = adminCommandFileName[0].split('_');
				// eslint-disable-next-line no-unused-vars
				for (const [key, value] of Object.entries(roles.admin_roles)) {
					if (message.member.roles.cache.has(`${value}`)) {

						// Ensure the command can only be ran from the admin channel
						if (message.channel.id != channels.admin_channel) return;

						if (command === adminCommandName[0]) {
							eval(adminCommandName[0]).process(message, args, pool, footer);
						}
					}
				}
			});

			/**
			 * STAFF COMMANDS
			 */
			const staffFiles = fs.readdirSync('commands/staff').filter(file => file.endsWith('.js'));

			staffFiles.forEach((tFile) => {
				const staffCommandFileName = tFile.split('.');
				const staffCommandName = staffCommandFileName[0].split('_');
				// eslint-disable-next-line no-unused-vars
				for (const [key, value] of Object.entries(roles.staff_roles)) {
					if (message.member.roles.cache.has(`${value}`)) {

						// Ensure the command can only be ran from the staff channel
						if (message.channel.id != channels.staff_channel || message.channel.id != channels.admin_channel) return;

						if (command === staffCommandName[0]) {
							eval(staffCommandName[0]).process(message, args, pool, footer);
						}
					}
				}
			});

			/**
			 * VERIFIED USER COMMANDS
			 */
			const verifiedFiles = fs.readdirSync('commands/verified').filter(file => file.endsWith('.js'));

			verifiedFiles.forEach((tFile) => {
				const verifiedCommandFileName = tFile.split('.');
				const verifiedCommandName = verifiedCommandFileName[0].split('_');
				if (message.member.roles.cache.has(roles.verified_role)) {

					// Ensure the command can only be ran from the verified channel
					if (message.channel.id != channels.verified_channel) return;

					if (command === verifiedCommandName[0]) {
						eval(verifiedCommandName[0]).process(message, args, pool, footer);
					}
				}
			});

			/**
			 * UNVERIFIED USER COMMANDS
			 */
			const unverifiedFiles = fs.readdirSync('commands/unverified').filter(file => file.endsWith('.js'));

			unverifiedFiles.forEach((tFile) => {
				const unverifiedCommandFileName = tFile.split('.');
				const unverifiedCommandName = unverifiedCommandFileName[0].split('_');

				// Ensure the command can only be ran from the unverified channel
				if (message.channel.id != channels.unverified_channel) return;

				if (command === unverifiedCommandName[0]) {
					eval(unverifiedCommandName[0]).process(message, args, pool, footer, roles.verified_role);
				}
			});
		});
	},
};