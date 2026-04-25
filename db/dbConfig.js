import "dotenv/config";

export default {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: console.log,
		pool: {
			max: 10,
			min: 2,
			acquire: 30000,
			idle: 10000
		},
	},
	test: {
		// ...
		logging: false,
	},
	production: {
		// ...
		logging: false,
		pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
	},
};