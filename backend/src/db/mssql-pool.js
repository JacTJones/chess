import sql from "mssql";
import "dotenv/config.js";

const config = {
	user: process.env.AZURE_SQL_USER,
	password: process.env.AZURE_SQL_PASSWORD,
	server: process.env.AZURE_SQL_SERVER,
	database: process.env.AZURE_SQL_DATABASE,
	options: {
		encrypt: true, // Enable encryption
		trustServerCertificate: true, // Trust the server certificate
	},
	pool: {
		max: 10, // Maximum number of connections in the pool
		min: 0, // Minimum number of connections in the pool
		idleTimeoutMillis: 30000, // How long a connection is allowed to be idle before being closed
	},
};

console.log(config);

export const pool = new sql.ConnectionPool(config);

export const makeQuery = async (query, values) => {
	const connection = await pool.connect();
	const request = connection.request();
	if (values) {
		for (let i = 0; i < values.length; i++) {
			request.input(values[i].name, values[i].value);
		}
	}

	const result = await request.query(query);

	pool.close();

	return result;
};
