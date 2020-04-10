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
					if (message.channel.id !== '486820348654911528') {
						return;
					}
					// Ensure arguments exist
					if (!args.length) {
						return message.channel.send('You did not provide any arguments!');
					}

					queryargs.query = 'SELECT username FROM accounts WHERE account_id IN (SELECT account_id from characters where firstname = ' + mysql.escape(args[0]) + ')';
					const accountdata = query.process(queryargs);

					accountdata.then(result => {
						console.log(result);
						result.forEach(element => {
							message.channel.send(element.username);
						});
					}).catch((err) => {
						const embed = new Discord.MessageEmbed()
							.setTitle('Get account error!')
							.setColor(0xff471a)
							.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
							.setDescription('**An error occurred, please send this error to the devs**: \n _' + err + '_');

						return message.channel.send(embed);
					});
				}

				/**
				 *  Get characters by account name
				 */
				if (command === 'getchars') {
					// Ensure the command can only be ran from the #admin channel
					if (message.channel.id !== '486820348654911528') {
						return;
					}
					// Ensure arguments exist
					if (!args.length) {
						return message.channel.send('You did not provide any arguments!');
					}
				}

				queryargs.query = 'select account_id, character_oid, firstname, surname, template, creation_date from characters where account_id in (select account_id from accounts where username = ' + mysql.escape(args[0]) + ')';
				const chardata = query.process(queryargs);

				chardata.then(result => {
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
							.attachFiles(['assets/images/species/' + part[0] + '.png'])
							.setURL('https://manage.swgsremu.com/admin/accounts/edit.php?type=game&account_id=' + element.account_id)
							.setColor(0x0099ff)
							.setDescription('**Character Object ID**: ' + element.character_oid + ' \n' +
							'**Character**: ' + race + ' ' + gender + ' - ' + firstname + ' ' + surname + '\n' +
							'**Date created**: ' + element.creation_date + '\n')
							.setThumbnail('attachment://' + part[0] + '.png');

						message.channel.send(embed);
					});
				}).catch((err) => {
					const embed = new Discord.MessageEmbed()
						.setTitle('Get characters error!')
						.setColor(0xff471a)
						.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
						.setDescription('**An error occurred, please send this error to the devs**: \n _' + err + '_');

					return message.channel.send(embed);
				});

				/**
				 *  Get trainer locations
				 */
				if (command === 'gettrainer') {
					// Ensure the command can only be ran from the #admin channel
					if (message.channel.id !== '486820348654911528') {
						return;
					}
					// Ensure enough arguments exist
					if (args.length != 2) {
						const embed = new Discord.MessageEmbed()
							.setTitle('Trainer location error!')
							.setColor(0xff471a)
							.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
							.setDescription('You did not provide enough arguments! \n **Usage**: !gettrainer <profession> <planet>');

						return message.channel.send(embed);
					}

					const planetName = args[1];

					// Convert profession names to their uncommon database name
					switch (args[0]) {
					case 'politician':
						args[0] = 'industrialist';
						break;
					case 'pikeman':
						args[0] = 'polearm';
						break;
					case 'carbineer':
						args[0] = 'carbine';
						break;
					case 'teraskasi':
						args[0] = 'unarmed';
						break;
					case 'swordsman':
						args[0] = '2hsword';
						break;
					case 'fencer':
						args[0] = '1hsword';
						break;
					}

					// Convert planet names to ID
					switch (args[1]) {
					case 'corellia':
						args[1] = 0;
						break;
					case 'dantooine':
						args[1] = 1;
						break;
					case 'dathomir':
						args[1] = 2;
						break;
					case 'endor':
						args[1] = 3;
						break;
					case 'lok':
						args[1] = 4;
						break;
					case 'naboo':
						args[1] = 5;
						break;
					case 'rori':
						args[1] = 6;
						break;
					case 'talus':
						args[1] = 7;
						break;
					case 'tatooine':
						args[1] = 8;
						break;
					case 'yavin':
						args[1] = 9;
						break;
					}

					queryargs.query = 'SELECT Location, `Trainer Name`, WorldX, WorldY, WorldZ FROM trainers WHERE `Trainer Type` = ' + mysql.escape('trainer_' + args[0]) + ' AND Planet = ' + mysql.escape(args[1]);
					const trainerdata = query.process(queryargs);

					trainerdata.then(result => {
						console.log(result);
						result.forEach(element => {

							const embed = new Discord.MessageEmbed()
								.setTitle('Trainer locations for: ' + mysql.escape(args[0]) + ' on ' + mysql.escape(planetName))
								.setColor(0x0099ff)
								.setDescription(
									'Location: ' + element.Location + '\n' +
									'X: ' + element.WorldX + ' Y: ' + element.WorldY + ' Z: ' + element.WorldZ,
								);

							message.channel.send(embed);
						});
					}).catch((err) => {
						const embed = new Discord.MessageEmbed()
							.setTitle('Trainer location error!')
							.setColor(0xff471a)
							.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
							.setDescription('**An error occurred, please send this error to the devs**: \n _' + err + '_');

						return message.channel.send(embed);
					});
				}

				// Release database connection
				params.pool.on('release', (connection) => {
					console.log('Database connection (%d) has been released.', connection.threadId);
				});
			}
		});
	},
};