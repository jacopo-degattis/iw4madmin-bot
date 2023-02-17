import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayIntentBits } from 'discord.js';
import { BotModule } from './bot/bot.module';
import { IW4MAdminModule } from './bot/modules/iw4madmin/iw4madmin.module';
import { MongoModule } from './bot/modules/mongo/mongo.module';
import { PollModule } from './bot/models/poll/poll.module';
import { PollService } from './bot/models/poll/poll.service';
import { ModelsModule } from './bot/models/models.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DiscordModule.forRootAsync({
      useFactory: () => {
        return {
          token: process.env.TOKEN,
          discordClientOptions: {
            intents: [
              GatewayIntentBits.Guilds,
              GatewayIntentBits.GuildMessages,
              GatewayIntentBits.GuildVoiceStates
            ]
          },
          registerCommandOptions: [{
            forGuild: process.env.GUILD_ID_WITH_COMMANDS,
            removeCommandsBefore: true,
          }],
          failOnLogin: true
        }
      },
    }),
    BotModule,
    MongoModule,
    IW4MAdminModule.register({
      env: process.env.ENV,
      address: process.env.SERVER_IP,
      port: parseInt(process.env.SERVER_PORT),
      isGlobal: true
    })
  ],
  providers: [],
  exports: []
})
export class AppModule { }
