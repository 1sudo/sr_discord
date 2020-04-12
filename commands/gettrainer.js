const mysql = require('mysql');
const query = require('../database/query');
const Discord = require('discord.js');

module.exports = {
	process: async (message, args, pool, footer) => {

		// Ensure enough arguments exist
		if (args.length != 2) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Trainer location error!')
				.setColor(0xff471a)
				.setFooter(footer)
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

		const planetembed = new Discord.MessageEmbed()
			.setTitle('Get trainer error!')
			.setColor(0xff471a)
			.setFooter(footer)
			.setDescription('**Invalid planet name!** \n' +
			'Usage: !gettrainer <profession name> <planet name>');

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
		default:
			return message.channel.send(planetembed);
		}

		const trainerdata = query.process(
			pool, 'SELECT Location, `Trainer Name`, WorldX, WorldY, WorldZ FROM trainers \
			WHERE `Trainer Type` = ' + mysql.escape('trainer_' + args[0]) + ' AND Planet = ' + mysql.escape(args[1]),
		);

		trainerdata.then(result => {

			let bufferstring = '';

			for (let i = 0; i < result.length; i++) {
				bufferstring = bufferstring + 'Location: ' + result[i].Location + '\n' + 'X: ' +
				result[i].WorldX + ' Y: ' + result[i].WorldY + ' Z: ' + result[i].WorldZ + '\n\n';
			}

			const embed = new Discord.MessageEmbed()
				.setTitle('Trainer locations for: ' + mysql.escape(args[0]) + ' on ' + mysql.escape(planetName))
				.setColor(0x0099ff)
				.setFooter(footer)
				.setDescription(bufferstring);

			return message.channel.send(embed);

		}).catch((err) => {
			const embed = new Discord.MessageEmbed()
				.setTitle('Trainer location error!')
				.setColor(0xff471a)
				.setFooter(footer)
				.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
				.setDescription('**An error occurred, please send this error to the devs**: \n _' + err + '_');

			return message.channel.send(embed);
		});

		query.release(pool);
	},
};