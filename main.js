import "dotenv/config";
import {Client, Events, GatewayIntentBits} from "discord.js";


import {CONFIG} from "./config.js";

const CLIENT = new Client({
	intents: [GatewayIntentBits.Guilds],
});

CLIENT.once(Events.ClientReady, async (client) => {
	await client.rest.post(`/channels/${CONFIG.CHANNEL_ID}/messages`, {
		body: {
			content: 'Test',
		},
	});
});

CLIENT.login(CONFIG.BOT_TOKEN).then(() => console.log('Logged in to discord'));