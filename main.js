import "dotenv/config";
import {Client, Events, GatewayIntentBits} from "discord.js";

import {CONFIG} from "./config.js";
import db from "./models/index.js";

const CLIENT = new Client({
	intents: [GatewayIntentBits.Guilds],
});

// Initialize database
async function initializeDatabase() {
	try {
		// Test database connection
		await db.sequelize.authenticate();
		console.log('Database connection successful');
		
		// Create new improvement record using Improvement model
		const result = await db.Improvement.create({
			value: 'New Entry',
			completed: false,
		});
		console.log('New improvement created:', result.toJSON());
		
	} catch (error) {
		console.error('Failed to connect to database:', error);
		process.exit(1);
	}
}

CLIENT.once(Events.ClientReady, async (client) => {
	console.log(`Bot logged in as ${client.user.tag}`);
	console.log('Closing database connection...');
	await db.sequelize.close();
	console.log('Database connection terminated');
	await client.destroy()
	// await client.rest.post(`/channels/${CONFIG.CHANNEL_ID}/messages`, {
	// 	body: {
	// 		content: 'Test',
	// 	},
	// });
});

// Initialize database and login
(async () => {
	try {
		await initializeDatabase();
		await CLIENT.login(CONFIG.BOT_TOKEN);
		console.log('Logged in to discord');
	} catch (error) {
		console.error('Failed to start bot:', error);
		process.exit(1);
	}
})();
