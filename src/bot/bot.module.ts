import { DiscordModule } from "@discord-nestjs/core";
import { Module } from "@nestjs/common";
// import { SetGameCommand } from "./commands/_set-game.command.ts";
import { SetGameCommand } from "./commands/set-game.command";
import { BotGateway } from "./bot.gateway";
import { HttpModule } from '@nestjs/axios'
import { IW4MApiService } from "./api.service";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        HttpModule,
        DiscordModule.forFeature(),
    ],
    providers: [SetGameCommand, BotGateway, IW4MApiService],
    exports: []
})
export class BotModule { }