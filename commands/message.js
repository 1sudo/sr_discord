const mysql = require('mysql');
const query = require('../func/query');
const Discord = require('discord.js');

module.exports = {
	process: (params) => {

		// Setup querying
		const queryargs = [];
		queryargs.pool = params.pool;

		params.client.on('message', async message => {
			// This ignores other bots and makes your bot ignore itself so as not to loop
			if (message.author.bot) return;

			// Ignore all commands that are not using the correct prefix
			if (message.content.indexOf(params.prefix) !== 0) return;

			// If user has Senior dev or SR staff roles (Right click role and copy ID)
			if (message.member.roles.cache.has('309447415172300802') || message.member.roles.cache.has('309444513649393664')) {
				// Define command and argument variables
				const args = message.content.slice(params.prefix.length).split(' ');
				const command = args.shift(0).toLowerCase();

				/**
				 *  Get account name by player name
				 */
				if (command === 'getaccount') {
					// Ensure the command can only be ran from the #admin channel
					if (message.channel.id !== '697727535911272468') {
						return;
					}
					// Ensure arguments exist
					if (!args.length) {
						return message.channel.send('You did not provide any arguments!');
					}

					queryargs.query = 'SELECT username FROM accounts WHERE account_id IN (SELECT account_id from characters where firstname = ' + mysql.escape(args[0]) + ')';
					const querydata = query.process(queryargs);

					querydata.then(result => {
						result.forEach(element => {
							message.channel.send(element.username);
						});
					});
				}

				/**
				 *  Get characters by account name
				 */
				if (command === 'getchars') {
					// Ensure the command can only be ran from the #admin channel
					if (message.channel.id !== '697727535911272468') {
						return;
					}
					// Ensure arguments exist
					if (!args.length) {
						return message.channel.send('You did not provide any arguments!');
					}
				}

				queryargs.query = 'select character_oid, firstname, surname, template, creation_date from characters where account_id in (select account_id from accounts where username = ' + mysql.escape(args[0]) + ')';
				const querydata = query.process(queryargs);

				querydata.then(result => {
					result.forEach(element => {

						// Format data
						const template = element.template.split('/');
						const part = template[3].split('.');
						const part2 = part[0].split('_');
						const race = part2[0].charAt(0).toUpperCase() + part2[0].slice(1);
						const gender = part2[1].charAt(0).toUpperCase() + part2[1].slice(1);
						const firstname = element.firstname.charAt(0).toUpperCase() + element.firstname.slice(1);
						const surname = element.surname.charAt(0).toUpperCase() + element.surname.slice(1);

						const embed = new Discord.MessageEmbed()
							.setTitle('Characters for account: ' + mysql.escape(args[0]))
							.setURL('https://manage.swgsremu.com/admin/accounts/edit.php?type=game&account=' + element.account_id)
							.setColor(0x0099ff)
							.setDescription('**Character Object ID**: ' + element.character_oid + ' \n' +
							'**Character**: ' + race + ' ' + gender + ' - ' + firstname + ' ' + surname + '\n' +
							'**Date created**: ' + element.creation_date + '\n')
							.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png');

						message.channel.send(embed);
					});
				});

				// Release database connection
				params.pool.on('release', (connection) => {
					console.log('Database connection (%d) has been released.', connection.threadId);
				});
			}
		});
	},
};