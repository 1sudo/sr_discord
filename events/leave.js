const mysql = require('mysql');
const query = require('../database/query');
const Discord = require('discord.js');

module.exports = {
	process: (client, pool, footer, channels) => {
		client.on('guildMemberRemove', (member) => {

			/**
			 * Roles formatting
			 */
			const allroles = member._roles;
			let tRoles = '';

			// Concatenate roles to string
			allroles.forEach(role => {
				tRoles = tRoles + role + '|';
			});

			// Remove trailing pipe character at end of string
			const roles = tRoles.substring(0, tRoles.length - 1);

			/**
			 * Database
			 */
			const memberdata = query.process(
				pool, 'INSERT INTO discord_leave (username, roles, timestamp) \
				VALUES (' + mysql.escape(member.user.username + '#' + member.user.discriminator) + ',' +
				mysql.escape(roles) + ',' + mysql.escape(member.joinedTimestamp) + ')',
			);

			memberdata.then(() => {
				return console.log('User (' + member.user.username + ') has left the server.');
			}).catch((err) => {

				const embed = new Discord.MessageEmbed()
					.setTitle('Member left but MySQL returned error!')
					.setColor(0xff471a)
					.setThumbnail('https://swgsremu.com/wp-content/uploads/2018/08/sr-jedi-white-60.png')
					.setFooter(footer)
					.setDescription('An error was encountered when inserting data into the database: ' + err);

				return member.guild.channels.cache.get(channels.admin_channel).send(embed);
			});


			const checkverify = query.process(
				pool, 'SELECT tag FROM discord_verified where tag = ' + mysql.escape(member.user.username + '#' + member.user.discriminator),
			);

			checkverify.then(result => {
				if (result.length > 0) {
					const verifyremove = query.process(
						pool, 'DELETE FROM discord_verified where tag = ' + mysql.escape(member.user.username + '#' + member.user.discriminator),
					);

					verifyremove.then(() => {
						console.log('User (' + member.user.username + '#' + member.user.discriminator + ') has left and has been removed from the verified users list.');
					}).catch(() => {
						console.log('An error occurred removing user (' + member.user.username + '#' + member.user.discriminator + ') from the verified users list.');
					});
				}
			}).catch(
				console.log('Unverified user (' + member.user.username + '#' + member.user.discriminator + ') has left.'),
			);

			query.release(pool);
		});
	},
};