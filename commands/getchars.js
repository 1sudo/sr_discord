const mysql = require('mysql');
const query = require('../func/query');
const Discord = require('discord.js');

module.exports = {
	process: (message, args, pool) => {

		// Ensure the command can only be ran from the #admin channel
		if (message.channel.id !== '697727535911272468') {
			return;
		}
		// Ensure arguments exist
		if (!args.length) {
			return message.channel.send('You did not provide any arguments!');
		}

		const chardata = query.process(
			pool, 'select account_id, character_oid, firstname, surname, template, creation_date from characters \
			where account_id in (select account_id from accounts where username = ' + mysql.escape(args[0]) + ')',
		);

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

				return message.channel.send(embed);
			});
		}).catch((err) => {
			const embed = new Discord.MessageEmbed()
				.setTitle('Get characters error!')
				.setColor(0xff471a)
				.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
				.setDescription('**An error occurred, please send this error to the devs**: \n _' + err + '_');

			return message.channel.send(embed);
		});

		query.release(pool);

	},
};