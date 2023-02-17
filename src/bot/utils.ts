import { Collection, Interaction, NonThreadGuildBasedChannel } from "discord.js";
import { GameMap, GameMode } from "./common/enums/set-game.enum";

export async function getVoiceChannels(interaction: Interaction): Promise<Collection<string, NonThreadGuildBasedChannel>> {
  const channels = await interaction.guild.channels.fetch();
  return channels.filter((channel) => channel.isVoiceBased())
}

export async function getClientCurrentVoiceChannel(interaction: Interaction, userId: string) {
  const voiceChannels = await getVoiceChannels(interaction);

  return voiceChannels.filter(
    (voiceChannel) => voiceChannel.members.filter(
      (user) => user.id === userId).size > 0
  )
}

export function tagUser(interaction: Interaction): string {
  return `<@${interaction.user.id}>`
}

// Such as 'Mob Of The Dead'
export function translate(name: string): string {
  if (!(name.includes('_'))) {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
  }

  return name.split('_').map(word => {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
  }).join(' ');
}

// Mapping

type MapsConfigValue = {
  gamemodes: Array<GameMode>,
  codeName: string,
  // Define filename specification 
  // For example buried has zm_classic_processing instead of
  // zm_classic_buried so I gotta specify it
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

export const GenericException: (message: string) => void = (message) => {
  return new Error(message);
}

GenericException.prototype = Object.create(Error.prototype);
