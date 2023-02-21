import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
import { SetGameCommand } from "./commands/set-game.command";
import { BotGateway } from "./bot.gateway";
import { ModelsModule } from "./models/models.module";
import { VoteCommand } from "./commands/vote.command";
import { PollCommand } from "./commands/poll.command";

@Module({
  imports: [
    ModelsModule,
    DiscordModule.forFeature(),
  ],
  providers: [SetGameCommand, VoteCommand, BotGateway, PollCommand],
  exports: []
})
export class BotModule { }
