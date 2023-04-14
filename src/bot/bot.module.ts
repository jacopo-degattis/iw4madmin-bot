import { Module } from "@nestjs/common";
import { DiscordModule } from "@discord-nestjs/core";

import { BotGateway } from "./bot.gateway";
import { ModelsModule } from "./models/models.module";
import { PollCommand } from "./commands/poll.command";
import { SetGameCommand } from "./commands/set-game.command";
import { GameParserModule } from "./common/services/game-parser/game-parser.module";
import { GameParserService } from "./common/services/game-parser/game-parser.service";
import { SelectServerCommand } from "./commands/select.command";

@Module({
  imports: [
    ModelsModule,
    GameParserModule,
    DiscordModule.forFeature(),
  ],
  providers: [
    SetGameCommand,
    BotGateway,
    PollCommand,
    GameParserService,
    SelectServerCommand
  ],
  exports: []
})
export class BotModule { }
