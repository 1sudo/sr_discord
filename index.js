const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
const mysql = require('mysql');

// Bot functions
const message = require('./events/message');
const join = require('./events/join');
const leave = require('./events/leave');

// Get environment variables
dotenv.config();
const token = process.env.BOT_TOKEN;
const mysql_connlimit = process.env.MYSQL_CONNLIMIT;
const mysql_host = process.env.MYSQL_HOST;
const mysql_user = process.env.MYSQL_USER;
const mysql_pass = process.env.MYSQL_PASS;
const mysql_db = process.env.MYSQL_DB;
const prefix = process.env.COMMAND_PREFIX;
const footer = process.env.FOOTER_TEXT;
const cAdmin_roles = process.env.ADMIN_ROLES;
const admin_channel = process.env.ADMIN_CHANNEL;
const cStaff_roles = process.env.STAFF_ROLES;
const staff_channel = process.env.STAFF_CHANNEL;
const cVerified_roles = process.env.VERIFIED_ROLES;
const verified_channel = process.env.VERIFIED_CHANNEL;
const unverified_channel = process.env.UNVERIFIED_CHANNEL;
const cUnverified_roles = process.env.UNVERIFIED_ROLES;

// Create MySQL pool
const pool = mysql.createPool({
	connectionLimit: mysql_connlimit,
	host: mysql_host,
	user: mysql_user,
	password: mysql_pass,
	database: mysql_db,
});

// Notify once the bot has connected.
client.once('ready', () => {
	console.log('ready');
	client.user.setActivity(
		'Sentinels Republic', {
			type: 'STREAMING',
			url: 'https://swgsremu.com',
		});
});

/**
 * Admin roles
 */
const tAdmin_roles = cAdmin_roles.split(',');
const admin_roles = {};

tAdmin_roles.forEach((role) => {
	const part = role.split('|');
	const role_name = part[0];
	const role_id = part[1];

	admin_roles[role_name] = role_id;
});

/**
 * Staff roles
 */
const tStaff_roles = cStaff_roles.split(',');
const staff_roles = {};

tStaff_roles.forEach((role) => {
	const part = role.split('|');
	const role_name = part[0];
	const role_id = part[1];

	staff_roles[role_name] = role_id;
});

/**
 * Verified roles
 */
const tVerified_roles = cVerified_roles.split(',');
const verified_roles = {};

tVerified_roles.forEach((role) => {
	const part = role.split('|');
	const role_name = part[0];
	const role_id = part[1];

	verified_roles[role_name] = role_id;
});

/**
 * Verified roles
 */
const tUnverified_roles = cUnverified_roles.split(',');
const unverified_roles = {};

tUnverified_roles.forEach((role) => {
	const part = role.split('|');
	const role_name = part[0];
	const role_id = part[1];

	unverified_roles[role_name] = role_id;
});

/**
 * All roles object
 */
const roles = {
	admin_roles: admin_roles,
	staff_roles: staff_roles,
	verified_roles: verified_roles,
	unverified_roles: unverified_roles,
};

/**
 * Channels
 */
const channels = {
	admin: {
		channels: {
			admin: admin_channel,
		},
	},
	staff: {
		channels: {
			admin: admin_channel,
			staff: staff_channel,
		},
	},
	verified: {
		channels: {
			verified: verified_channel,
			staff: staff_channel,
			admin: admin_channel,
		},
	},
	unverified: {
		channels: {
			unverified: unverified_channel,
		},
	},
};

message.process(client, prefix, pool, footer, roles, channels);
join.process(client, pool, footer, channels);
leave.process(client, pool, footer, channels);

client.login(token);