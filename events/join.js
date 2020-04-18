const mysql = require('mysql');
const query = require('../database/query');
const Discord = require('discord.js');

module.exports = {
	process: async (client, pool, footer, channels) => {

		client.on('guildMemberAdd', (member) => {
			const memberid = member.user.id;

			function sleep(time) {
				return new Promise((resolve) => setTimeout(resolve, time));
			}

			// Sleep so the user has time to load into the server before the welcome message is sent
			sleep(2000).then(() => {

				/**
				 * Database
				 */
				const memberdata = query.process(
					pool, 'INSERT INTO discord_join (username, timestamp) \
					VALUES (' + mysql.escape(member.user.username + '#' + member.user.discriminator) + ',' +
					mysql.escape(member.joinedTimestamp) + ')',
				);

				memberdata.then(() => {
					console.log('User (' + member.user.username + ') has joined the server.');
				}).catch((err) => {

					const embed = new Discord.MessageEmbed()
						.setTitle('Member joined but MySQL returned error!')
						.setColor(0xff471a)
						.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
						.setFooter(footer)
						.setDescription('An error was encountered when inserting data into the database: ' + err);

					member.guild.channels.cache.get(channels.admin_channel).send(embed);
				});

				query.release(pool);

				const embed = new Discord.MessageEmbed()
					.setTitle('Welcome to Sentinels Republic!')
					.setColor(0x0099ff)
					.setURL('https://swgsremu.com/play-now/')
					.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
					.setFooter(footer)
					.setDescription(`Welcome sentient, \n
					I am C-3P0, protocol droid, human-cyborg relations . I am fluent in over 6 million forms of communication.

					To get started, please follow these steps:
					1) [Create an account](https://manage.swgsremu.com/register.php).
					2) [Download the launcher](http://swgsremu.com/support/launcher-download/).
					3) In the launcher, click **Game Config**, then **Run Setup** and follow the on-screen instructions.

					More detailed instructions for installation/registration can be found [here](https://swgsremu.com/play-now/).
					
					To access all Discord channels, type this in Discord once you have your character created:
					**!verify <character first name>**
					
					Once you've verified your account, you will then have access to the rest of the Discord channels. 
					
					If you encounter any issues, please let us know.`);

				return member.guild.channels.cache.get(channels.unverified.channels.unverified).send(`<@${memberid}>`, embed);

			});
		});
	},
};