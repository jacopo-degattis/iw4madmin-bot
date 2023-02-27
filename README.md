
# IW4MADMIN Discord Bot

## Description

A simple discord bot that help you execute RCON commands on your IW4MADMIN server.

## Installation

```bash
  $ pnpm i
```

## Running the bot

First thing first you must set ENV variables in the .env file.

```
  TOKEN: Discord bot associated token

  GUILD_ID: TODO
  
  SERVER_IP: The ip address of the machine that hosts your IW4MADMIN server

  IW4PORT: The port the IW4ADMIN server is listening to
```

After you setup the .env file you can launch the bot using:

```
  // For dev mode
  $ pnpm run start:dev 

  // For prod mode
  $ pnpm run start
```

## Running the bot through Docker

First create a .env file inside the root directory of the project.

You should set the following variables:

- ENV: dev | "anything else"
- SERVER_IP: Ip address of the server hosting the iw4madmin platform
- SERVER_PORT: Port where iw4madmin is listening onto
- BOT_TOKEN: Token of the discord bot you'd like to use
- BOT_GUILD_ID: Guild id of the discord server which use this bot

N.B: don't touch mongo configuration