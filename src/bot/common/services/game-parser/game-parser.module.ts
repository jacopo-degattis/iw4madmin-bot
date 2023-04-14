import { Module } from "@nestjs/common";
import { GameParserService } from "./game-parser.service";

@Module({
  imports: [],
  providers: [GameParserService],
  exports: [GameParserService]
})
export class GameParserModule { }