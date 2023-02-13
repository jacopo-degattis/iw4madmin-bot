import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GatewayIntentBits } from 'discord.js';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          token: configService.get<string>('TOKEN'),
          discordClientOptions: {
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
          },
          registerCommandOptions: [{
            forGuild: configService.get('GUILD_ID_WITH_COMMANDS'),
            removeCommandsBefore: true,
          }],
          failOnLogin: true
        }
      },
      inject: [ConfigService]
    }),
    BotModule
  ],
})
export class AppModule {}
