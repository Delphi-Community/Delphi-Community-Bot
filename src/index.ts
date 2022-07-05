require('dotenv').config()
import * as fs from 'fs';
import { Collection, Intents, Interaction } from 'discord.js';
import { Client} from 'discord.js';
import * as path from 'node:path';
import { Deployment } from './deploy-commands';
import type { PathLike } from 'fs';

const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const clientCommands = new Collection();

const commandsPath: PathLike = path.join(__dirname, 'commands');
const commandFiles: string[] = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	clientCommands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async (interaction: Interaction) => {
	if (!interaction.isCommand()) return;
	
	const command: any = clientCommands.get(interaction.commandName);
	console.error(command);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


async function main() {
	const dep = new Deployment();
	await dep.execute().then(() => console.log('Successfully registered application commands.')).catch(console.error);
	await client.login(process.env.DC_TOKEN).then(() => {
		console.log('Logged in!');
	}).catch(console.error);
}

main();



