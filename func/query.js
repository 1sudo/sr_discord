module.exports = {
	process: (params) => {
		return new Promise((resolve, reject) => {
			params.pool.query(
				params.query,
				(err, rows) => {
					if (err) return reject(err);
					return resolve(rows);
				});
		});
	},
};