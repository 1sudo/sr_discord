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

		const accountdata = query.process(
			pool, 'SELECT username FROM accounts WHERE account_id IN \
			(SELECT account_id from characters where firstname = ' + mysql.escape(args[0]) + ')',
		);

		accountdata.then(result => {
			result.forEach(element => {
				const embed = new Discord.MessageEmbed()
					.setTitle('Account name for player: ' + args[0])
					.setColor(0x0099ff)
					.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
					.setDescription('Account name: ' + element.username.charAt(0).toUpperCase() + element.username.slice(1));

				return message.channel.send(embed);
			});
		}).catch((err) => {
			const embed = new Discord.MessageEmbed()
				.setTitle('Get account error!')
				.setColor(0xff471a)
				.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
				.setDescription('**An error occurred, please send this error to the devs**: \n _' + err + '_');

			return message.channel.send(embed);
		});

		query.release(pool);

	},
};