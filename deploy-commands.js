const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
	new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Says hello back to you!')
		.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		console.log('Registering slash commands...');
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands }
		);
		console.log('Done!');
	} catch (err) {
		console.error(err);
	}
})();