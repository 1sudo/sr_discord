const getaccount = require('./commands/getaccount');
const getchars = require('./commands/getchars');
const gettrainer = require('./commands/gettrainer');

module.exports = {
	process: (client, prefix, pool) => {

		// Setup querying
		const queryargs = [];
		queryargs.pool = pool;

		client.on('message', async message => {
			// Ignore other bots and makes your bot ignore itself so as not to loop and require prefix
			if (message.author.bot) return;
			if (message.content.indexOf(prefix) !== 0) return;

			/**
			 * ADMIN COMMANDS
			 */
			if (message.member.roles.cache.has('309447415172300802') || message.member.roles.cache.has('309444513649393664')) {

				const args = message.content.slice(prefix.length).split(' ');
				const command = args.shift(0).toLowerCase();

				if (command === 'getaccount') {
					getaccount.process(message, args, pool);
				}

				if (command === 'getchars') {
					getchars.process(message, args, pool);
				}

				if (command === 'gettrainer') {
					gettrainer.process(message, args, pool);
				}
			}
		});
	},
};