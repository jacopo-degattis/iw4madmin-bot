import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { Game } from 'src/bot/modules/iw4madmin/iw4madmin.enum';

enum GameMode {
  CLASSIC = "classic",
  STANDARD = "standard",
  GRIEF = "grief",
  TURNED = "cleansed",
}

export interface GameMap {
  key: string;
  name: string;
  gamemodes: Array<GameMode>,
  filenames: Array<{ [key: string]: string }>
}

export interface GameConfigFile {
  game: string;
  short_name: Game;
  maps: Array<GameMap>
}

@Injectable()
export class GameParserService {

  private gameFolder: string;
  private readonly logger = new Logger(GameParserService.name);
  gameConfigFiles: Partial<Record<Game, GameConfigFile>> = {};

  constructor() {
    this.gameFolder = path.resolve(__dirname, '../../../../games');
  }

  private listGameFiles(): Array<string> {
    return fs.readdirSync(this.gameFolder)
  }

  private parseConfigFile(fileName: string) {
    try {
      const configFile = fs.readFileSync(`${this.gameFolder}/${fileName}`, 'utf-8');
      const parsedConfigFile: GameConfigFile = JSON.parse(configFile);
      return parsedConfigFile
    } catch (e) {
      // Submit the error to the user, through terminal or also through discord chat
      console.log(`[!] An error occurred while parsing file ${fileName}`, e);
    }
  }

  parseAllConfigFiles(): Partial<Record<Game, GameConfigFile>> {
    const configFiles = this.listGameFiles()

    configFiles.forEach((configFile) => {

      this.logger.log(`Parsing config file for ${configFile.split('.')[0]} game`);

      const gameConfig = this.parseConfigFile(configFile);
      this.gameConfigFiles[gameConfig.short_name] = gameConfig;
    })

    return this.gameConfigFiles
  }

}