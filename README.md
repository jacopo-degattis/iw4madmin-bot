
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