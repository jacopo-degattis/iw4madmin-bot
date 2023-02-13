import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
// import { SetGameCommand } from "./commands/_set-game.command.ts";
import { SetGameCommand } from "./commands/set-game.command";
import { BotGateway } from "./bot.gateway";

@Module({
    imports: [DiscordModule.forFeature()],
    providers: [SetGameCommand, BotGateway],
})
export class BotModule { }