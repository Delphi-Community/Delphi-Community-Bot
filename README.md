<div align="center">
  <p>
    <a href="https://delphi-community.com"><img src="https://delphi-community.com/img/dc-icon.png" alt="Delphi Community logo" height="300px" /></a>    
  </p>
  <br />
  <p>
    <a href="https://discord.gg/c382VBk"><img src="https://img.shields.io/discord/623794270255579146?label=Discord&style=plastic" alt="Discord server" /></a>
    <a href="https://delphi-community.com"><img src="https://img.shields.io/website?down_message=offline&style=plastic&up_message=online&url=https%3A%2F%2Fdelphi-community.com" alt="Website" /></a>
  </p>
  <a href="https://delphi-community.com">delphi-community.com</a>
    
</div>



# delphi-community.com

Welcome to the Delphi Community – your central hub for Delphi and Pascal programming enthusiasts on Discord!

## About

Delphi-Community.com is a vibrant Discord community focused on the Pascal and Delphi programming languages. We aim to provide a collaborative and inclusive space where both beginners and experienced programmers can share ideas, seek advice, and discuss various aspects of Delphi and Pascal programming.

## Contributing

Contributions from community members are the backbone of our server. Whether you’re sharing knowledge, providing feedback, or contributing to discussions, your input is invaluable.

# Bot

## Installation

Install node modules
```
npm install
```

Set environement vars on your system or copy create .env file. [Check out .env.sample](https://github.com/Delphi-Community/Delphi-Community-Bot/blob/main/.env.sample).

Invite the bot: https://discord.com/api/oauth2/authorize?client_id=APP_ID&permissions=8&scope=bot+applications.commands

Register SlashCommands
```sh
node .\deploy-commands.js
```

Run bot
```sh
node .
```

## Features
- RSS cronjob (Tracks RSS feeds and notifys a channel (forum) every 10 minutes, admins only)

## Commands
- ping
- format (converts a message to a pascal code block)
- rss list
- rss add [url] [channel]
- rss remove [id] (get the id from rss list)
- rss runcronjob

### Message commands
@bot code somecode (converts a message to a pascal code block)

## NodeJS Modules

- Winston: Logging
- sqlite3: Data storage
- discord.js: Discord integration
- dotenv: Environment variables management
- node-cron: Task scheduling
- rss-parser: RSS feed parsing
- winston-daily-rotate-file: Log file rotation
- winston-transport-discord: Log file mirror for discord


---

Join us on [Discord](https://discord.com/invite/c382VBk) to be a part of our growing Delphi and Pascal programming community!
