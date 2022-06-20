<div align="center">
  <p>
    <a href="https://delphi-community.com"><img src="https://delphi-community.com/img/delphicommunity.png" alt="Delphi Community logo" height="300px" /></a>    
  </p>
  <br />
  <p>
    <a href="https://discord.gg/c382VBk"><img src="https://img.shields.io/discord/623794270255579146?label=Discord&style=plastic" alt="Discord server" /></a>
    <a href="https://delphi-community.com"><img src="https://img.shields.io/website?down_message=offline&style=plastic&up_message=online&url=https%3A%2F%2Fdelphi-community.com" alt="Website" /></a>
  </p>
</div>

# About
This repo represents the official Discord bot of [Delphi Community](https://discord.gg/c382VBk).

Features
* Slash Commands
    * /getting-started [client]
    * /markdown [client]

## Getting Started

Install [Node.js®](https://nodejs.org/) on your machine.

### Install dependencies
```
npm install
```

### Register slash commands
If something got changed in /src/commands, execute this command.
```
node /src/deploy-commands.js
```

### Run the bot
```
node .
```

## Why isn't it written in Pascal?
We've already tried writing our own bot in Delphi & Lazarus/FreePascal.
This took us a lot of effort & time.

Because the lack of time we made the decision to use [discord.js](https://github.com/discordjs/discord.js/) which is well supported and easy to setup.