import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = new Map();

async function loadCommands() {
	const files = fs
		.readdirSync(__dirname)
		.filter(file => {
			return (
				file.indexOf('.') !== 0 &&
				file !== 'index.js' &&
				file.slice(-3) === '.js'
			);
		});

	for (const file of files) {
		const modulePath = path.join(__dirname, file);
		const commandModule = await import(`file://${modulePath}?t=${Date.now()}`);
		const command = commandModule.default;
		commands.set(command.data.name, command);
	}
}

await loadCommands();

export default commands;

