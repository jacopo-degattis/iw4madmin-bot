import { Collection, Guild, GuildMember, Interaction, NonThreadGuildBasedChannel } from "discord.js";

import { Roles } from "./common/enums/roles.enum";

type ChannelCollection = Collection<string, NonThreadGuildBasedChannel>;

// Return the channel where the bot has been invoked (text channel one)
export async function getCurrentBotTextChannel(interaction: Interaction): Promise<NonThreadGuildBasedChannel> {
  return interaction.guild.channels.cache.get(interaction.channel.id) as NonThreadGuildBasedChannel
}

// Check if a member as a specified role
export async function memberHasRole(role: Roles, member: GuildMember): Promise<boolean> {
  return member.roles.cache.filter(currRole => {
    return currRole.name === role
  }).size > 0;
}

// Same thing as the function above it, TODO: anyway I can merge this function instead of creating two different one ?
export async function getVoiceChannelsByGuild(guild: Guild): Promise<ChannelCollection> {
  const channels = await guild.channels.fetch();
  return channels.filter((channel) => channel.isVoiceBased());
}

// Get a full list of voice channels related to the guild id provided using the interaction parameter
export async function getVoiceChannels(interaction: Interaction): Promise<Collection<string, NonThreadGuildBasedChannel>> {
  const channels = await interaction.guild.channels.fetch();
  return channels.filter((channel) => channel.isVoiceBased())
}

// Get current voice channel from a collections of voice channels and a provided user id
export async function getUserCurrentVoiceChannel(voiceChannels: ChannelCollection, userId: string): Promise<ChannelCollection> {
  return voiceChannels.filter(
    (voiceChannel) => voiceChannel.members.filter(
      (user) => user.id === userId).size > 0
  )
}

// Get current voice channel from the provided interaction
export async function getClientCurrentVoiceChannel(interaction: Interaction, userId: string) {
  const voiceChannels = await getVoiceChannels(interaction);

  return getUserCurrentVoiceChannel(voiceChannels, userId);
}

// Utils function to tag a user providing discord.js interaction
export function tagUser(interaction: Interaction): string {
  return `<@${interaction.user.id}>`
}

export async function getCurrentVoiceChannelByGuild(guild: Guild, userId: string): Promise<NonThreadGuildBasedChannel> {
  const voiceChannels = await getVoiceChannelsByGuild(guild);
  return (await getUserCurrentVoiceChannel(voiceChannels, userId)).at(0);
}

// Translate a encoded name such as 'mob_of_the_dead' to a more human readable one as 'Mob Of The Dead'
export function translate(name: string): string {
  if (!(name.includes('_'))) {
    return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
  }

  return name.split('_').map(word => {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
  }).join(' ');
}

export const GenericException: (message: string) => void = (message) => {
  return new Error(message);
}

GenericException.prototype = Object.create(Error.prototype);
