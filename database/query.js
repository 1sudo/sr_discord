module.exports = {
	process: (pool, query) => {
		return new Promise((resolve, reject) => {
			pool.query(
				query,
				(err, rows) => {
					if (err) return reject(err);
					return resolve(rows);
				});
		});
	},
	release: (pool) => {
		// Release database connection
		// eslint-disable-next-line no-unused-vars
		pool.on('release', (connection) => {
			// console.log('Database connection (%d) has been released.', connection.threadId);
		});
	},
};