export enum GameMap {
    // TODO: gotta prefix zm_ before each one of these keys

    // DEFAULT GAMES MAP (NO DLC)
    TRANSIT = "transit",
    FARM = "farm",
    TOWN = "town",
    DINER = "diner",
    BUS_DEPOT = "bus_depot",

    // DLC MAPS
    ORIGINS = "origins",
    NUKETOWN = "nuketown",
    MOB_OF_THE_DEAD = "mob_of_the_dead",
    DIE_RISE = "die_rise",
    BURIED = "buried"
}

export enum GameMode {
    CLASSIC = "CLASSIC",
    STANDARD = "STANDARD",
    GRIEF = "GRIEF",
    TURNED = "TURNED", // Same as CLEANSED
}

// TODO: extend this list with all the available options
const availableModesByMap: Record<string, Array<string>> = {
    [GameMap.TRANSIT]: [GameMode.CLASSIC],
    [GameMap.FARM]: [GameMode.STANDARD, GameMode.GRIEF] 
}

// TODO: maybe move into utils
export const getAvailableModesByMap: (map: GameMap) => Array<string> = (map) => {
    return availableModesByMap[map];
}