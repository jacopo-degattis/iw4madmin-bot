import { Choice, Param } from '@discord-nestjs/core';
import { Transform } from 'class-transformer';
import { GameMap, GameMode } from '../../enums/set-game.enum';

export class SetGameDto {

  @Transform(({ value }) => value.toLowerCase())
  @Param({
    name: 'map',
    description:
      'Set the map you want to play',
    required: true,
    autocomplete: true,
  })
  map: GameMap;

  @Transform(({ value }) => value.toLowerCase())
  @Param({
    name: 'gamemode',
    description: 'Set the gamemode you want to play',
    required: true,
    autocomplete: true
  })
  gamemode: GameMode

}
