require('dotenv').config()
import * as fs from 'fs';
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

class Deployment{
	commands: any = [];
	commandsPath: fs.PathLike = path.join(__dirname, 'commands');
	commandFiles = fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.ts'));

	execute(){
		const rest = new REST({ version: '9' }).setToken(process.env.DC_TOKEN);
		return rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), { body: this.commands });
	}

	constructor(){
		for (const file of this.commandFiles) {
			const filePath = path.join(this.commandsPath, file);
			const command = require(filePath);
			
			this.commands.push(command.data.toJSON());
		}	
	}
}

export { Deployment };