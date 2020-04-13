const mysql = require('mysql');
const query = require('../../database/query');
const Discord = require('discord.js');

module.exports = {
	process: async (message, args, pool, footer, verified_role) => {

		// Ensure arguments exist
		if (!args.length) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Verification error!')
				.setColor(0xff471a)
				.setFooter(footer)
				.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
				.setDescription('**Please provide your characters first name!** \n' + '**Example**: !verify obi-wan');

			return message.channel.send(embed);
		}

		if (message.author.id == message.author.id) {
			message.delete();
		}

		const chardata = query.process(
			pool, 'select account_id, firstname, surname, template from characters where firstname = ' + mysql.escape(args[0]),
		);

		chardata.then(result => {
			if (result.length > 0) {
				result.forEach(element => {
					// Format data
					const template = element.template.split('/');
					const part = template[3].split('.');
					const part2 = part[0].split('_');
					const race = part2[0].charAt(0).toUpperCase() + part2[0].slice(1);
					const gender = part2[1].charAt(0).toUpperCase() + part2[1].slice(1);
					const firstname = element.firstname.charAt(0).toUpperCase() + element.firstname.slice(1);
					const surname = element.surname.charAt(0).toUpperCase() + element.surname.slice(1);

					// message.channel.send(message.member.user.tag);

					const roleid = verified_role;

					if (message.member.roles.cache.has(roleid)) {
						const embed = new Discord.MessageEmbed()
							.setTitle('Verification error!')
							.setColor(0xff471a)
							.setFooter(footer)
							.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
							.setDescription('**Your account is already verified!**');

						return message.channel.send(embed);
					}

					message.member.roles.add(roleid).then(() => {
						const embed = new Discord.MessageEmbed()
							.setTitle('Verification successful')
							.attachFiles(['assets/images/species/' + part[0] + '.png'])
							.setColor(0x0099ff)
							.setFooter(footer)
							.setDescription(
								'**Character: ' + race + ' ' + gender + ' - ' + firstname + ' ' + surname + '**\n' +
								'Welcome to the Sentinels Republic Discord!' + '\n' +
								'You have now been granted access to the rest of the public chat channels. \n \n' +
								'[Website](http://www.swgsremu.com) | ' +
								'[Forums](https://forum.swgsremu.com) | ' +
								'[Launcher](http://swgsremu.com/support/launcher-download) \n \n' +
								'[Events](https://swgsremu.com/updates/events/) | ' +
								'[Facebook](https://facebook.com/SentinelsRepublicEmu) | ' +
								'[Twitter](https://twitter.com/SentinelsRepEMU) | ' +
								'[Wiki](http://sremu.wikia.com/wiki/SWG_Sentinels_Republic_Wiki) \n \n' +
								'Please let us know if you need any help!',
							).setThumbnail('attachment://' + part[0] + '.png');

						return message.channel.send(embed);
					}).catch(err => {
						const embed = new Discord.MessageEmbed()
							.setTitle('Verification error!')
							.setColor(0xff471a)
							.setFooter(footer)
							.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
							.setDescription('**Something went wrong: ' + err + '**' + '\n Please report this issue to a developer!');

						return message.channel.send(embed);
					});
				});
			}
			else {
				const embed = new Discord.MessageEmbed()
					.setTitle('Verification error!')
					.setColor(0xff471a)
					.setFooter(footer)
					.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
					.setDescription('**No character named: ' + args[0] + '**');

				return message.channel.send(embed);
			}
		}).catch((err) => {
			const embed = new Discord.MessageEmbed()
				.setTitle('Get characters error!')
				.setColor(0xff471a)
				.setFooter(footer)
				.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
				.setDescription('**An error occurred, please send this error to the devs**: \n _' + err + '_');

			return message.channel.send(embed);
		});

		query.release(pool);

	},
};