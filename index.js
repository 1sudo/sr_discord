const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
const mysql = require('mysql');

// Get environment variables
dotenv.config();
const token = process.env.BOT_TOKEN;
const mysql_connlimit = process.env.MYSQL_CONNLIMIT;
const mysql_host = process.env.MYSQL_HOST;
const mysql_user = process.env.MYSQL_USER;
const mysql_pass = process.env.MYSQL_PASS;
const mysql_db = process.env.MYSQL_DB;
const prefix = process.env.COMMAND_PREFIX;

// Create MySQL pool
const pool = mysql.createPool({
	connectionLimit: mysql_connlimit,
	host: mysql_host,
	user: mysql_user,
	password: mysql_pass,
	database: mysql_db,
});

// Require all bot commands
const message = require('./message');

// Notify once the bot has connected.
client.once('ready', () => {
	console.log('ready');
	client.user.setActivity(
		'Sentinels Republic', {
			type: 'STREAMING',
			url: 'https://swgsremu.com',
		});
});

message.process(client, prefix, pool);

client.login(token);