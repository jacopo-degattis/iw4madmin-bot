import { GameMap, GameMode } from "./common/enums/set-game.enum";

// Mapping

type MapsConfigValue = {
  gamemodes: Array<GameMode>,
  codeName: string,
  filenames?: Record<string, string>
}

type MapsConfig = Record<
  GameMap,
  MapsConfigValue
>

const mapsConfig: MapsConfig = {
  // Original maps
  [GameMap.DINER]: {
    gamemodes: [GameMode.TURNED],
    codeName: 'zm_transit_dr'
  },
  [GameMap.TRANSIT]: {
    gamemodes: [GameMode.CLASSIC],
    codeName: 'zm_transit',
  },
  [GameMap.FARM]: {
    gamemodes: [GameMode.STANDARD, GameMode.GRIEF],
    codeName: 'zm_transit',
  },
  [GameMap.TOWN]: {
    gamemodes: [GameMode.STANDARD, GameMode.GRIEF],
    codeName: 'zm_transit',
  },
  [GameMap.BUS_DEPOT]: {
    gamemodes: [GameMode.STANDARD, GameMode.GRIEF],
    codeName: 'zm_transit',
  },

  // // DLC maps
  [GameMap.ORIGINS]: {
    gamemodes: [GameMode.CLASSIC],
    codeName: 'zm_tomb',
    filenames: {
      [GameMode.CLASSIC]: 'tomb'
    }
  },
  [GameMap.NUKETOWN]: {
    gamemodes: [GameMode.STANDARD],
    codeName: 'zm_nuked',
    filenames: {
      [GameMode.STANDARD]: 'nuked'
    }
  },
  [GameMap.MOB_OF_THE_DEAD]: {
    gamemodes: [GameMode.CLASSIC, GameMode.GRIEF],
    codeName: 'zm_prison',
    filenames: {
      [GameMode.CLASSIC]: 'prison',
      [GameMode.GRIEF]: 'cellblock'
    },
  },
  [GameMap.DIE_RISE]: {
    gamemodes: [GameMode.CLASSIC],
    codeName: 'zm_highrise',
    filenames: {
      [GameMode.CLASSIC]: 'rooftop'
    },
  },
  [GameMap.BURIED]: {
    gamemodes: [GameMode.CLASSIC, GameMode.TURNED],
    codeName: 'zm_buried',
    filenames: {
      [GameMode.CLASSIC]: 'processing',
      [GameMode.TURNED]: 'street'
    },
  }
}

export function getMapConfigByName(mapName: GameMap): MapsConfigValue {
  return mapsConfig[mapName];
}

export const getAvailableModesByMap: (map: string) => Array<string> = (map) => {
  return getMapConfigByName(map as GameMap).gamemodes
}
