const fs = require('fs');

// Admin
// eslint-disable-next-line no-unused-vars
const getlogs = require('../commands/admin_getlogs');

// Staff
// eslint-disable-next-line no-unused-vars
const getaccount = require('../commands/staff_getaccount');
// eslint-disable-next-line no-unused-vars
const getchars = require('../commands/staff_getchars');

// Verified
// eslint-disable-next-line no-unused-vars
const gettrainer = require('../commands/verified_gettrainer');

// Unverified
// eslint-disable-next-line no-unused-vars
const verify = require('../commands/unverified_verify');

module.exports = {
	process: async (client, prefix, pool, footer, roles, channels) => {

		client.on('message', message => {

			// Ignore other bots and makes your bot ignore itself so as not to loop and require prefix
			if (message.author.bot) return;
			if (message.content.indexOf(prefix) !== 0) return;

			// Get command and arguments
			const args = message.content.slice(prefix.length).split(' ');
			const command = args.shift(0).toLowerCase();

			const adminFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).filter(file => file.startsWith('admin'));

			adminFiles.forEach((tFile) => {
				const adminCommandFileName = tFile.split('.');
				const adminCommandName = adminCommandFileName[0].split('_');
				// eslint-disable-next-line no-unused-vars
				for (const [key, value] of Object.entries(roles.admin_roles)) {
					if (message.member.roles.cache.has(`${value}`)) {

						let canIssue = false;
						// eslint-disable-next-line no-unused-vars
						for (const [channelName, channelID] of Object.entries(channels.admin.channels)) {
							if (message.channel.id == channelID) canIssue = true;
						}

						if (command === adminCommandName[1] && canIssue) {
							eval(adminCommandName[1]).process(message, args, pool, footer);
						}
					}
				}
			});

			const staffFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).filter(file => file.startsWith('staff'));

			staffFiles.forEach((tFile) => {
				const staffCommandFileName = tFile.split('.');
				const staffCommandName = staffCommandFileName[0].split('_');
				// eslint-disable-next-line no-unused-vars
				for (const [key, value] of Object.entries(roles.staff_roles)) {
					if (message.member.roles.cache.has(`${value}`)) {

						let canIssue = false;
						// eslint-disable-next-line no-unused-vars
						for (const [channelName, channelID] of Object.entries(channels.staff.channels)) {
							if (message.channel.id == channelID) canIssue = true;
						}

						if (command === staffCommandName[1] && canIssue) {
							eval(staffCommandName[1]).process(message, args, pool, footer);
						}
					}
				}
			});

			const verifiedFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).filter(file => file.startsWith('verified'));

			verifiedFiles.forEach((tFile) => {
				const verifiedCommandFileName = tFile.split('.');
				const verifiedCommandName = verifiedCommandFileName[0].split('_');
				// eslint-disable-next-line no-unused-vars
				for (const [key, value] of Object.entries(roles.verified_roles)) {
					if (message.member.roles.cache.has(`${value}`)) {

						let canIssue = false;
						// eslint-disable-next-line no-unused-vars
						for (const [channelName, channelID] of Object.entries(channels.verified.channels)) {
							if (message.channel.id == channelID) canIssue = true;
						}

						if (command === verifiedCommandName[1] && canIssue) {
							eval(verifiedCommandName[1]).process(message, args, pool, footer);
						}
					}
				}
			});

			const unverifiedFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).filter(file => file.startsWith('unverified'));

			unverifiedFiles.forEach((tFile) => {
				const unverifiedCommandFileName = tFile.split('.');
				const unverifiedCommandName = unverifiedCommandFileName[0].split('_');

				let canIssue = false;
				// eslint-disable-next-line no-unused-vars
				for (const [channelName, channelID] of Object.entries(channels.unverified.channels)) {
					if (message.channel.id == channelID) canIssue = true;
				}

				if (command === unverifiedCommandName[1] && canIssue) {
					// eslint-disable-next-line no-unused-vars
					for (const [roleName, roleID] of Object.entries(roles.verified_roles)) {
						eval(unverifiedCommandName[1]).process(message, args, pool, footer, roleID);
					}
				}
			});

		});
	},
};