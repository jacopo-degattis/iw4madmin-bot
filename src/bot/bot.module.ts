import { Module } from "@nestjs/common";
import { DiscordModule } from "@discord-nestjs/core";

import { BotGateway } from "./bot.gateway";
import { ModelsModule } from "./models/models.module";
import { PollCommand } from "./commands/poll.command";
import { SetGameCommand } from "./commands/set-game.command";

@Module({
  imports: [
    ModelsModule,
    DiscordModule.forFeature(),
  ],
  providers: [SetGameCommand, BotGateway, PollCommand],
  exports: []
})
export class BotModule { }
