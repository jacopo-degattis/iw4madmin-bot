import { Injectable, Logger } from "@nestjs/common";
import { InjectDiscordClient, On, Once } from "@discord-nestjs/core";
import { Message, PartialMessage, ReactionEmoji, GuildEmoji } from "discord.js";
import { AutocompleteInteraction, Client, ClientUser, Interaction, MessageReaction } from "discord.js";

import { getCurrentVoiceChannelByGuild, getGamemodeFromMap, tagUser } from "./utils";
import { Emoticon } from "./common/enums/emoji.enum";
import { GameMap } from "./common/enums/set-game.enum";
import { PollService } from './models/poll/poll.service';
import { VoteService } from "./models/vote/vote.service";
import { IW4MApiService } from "./modules/iw4madmin/iw4madmin.service";
import { getMapConfigByName, getAvailableModesByMap } from "./maps.mapping";
import { getUserCurrentVoiceChannel, getVoiceChannelsByGuild, translate } from "./utils";
import { GameConfigFile, GameParserService } from "./common/services/game-parser/game-parser.service";
import { Game } from "./modules/iw4madmin/iw4madmin.enum";

@Injectable()
export class BotGateway {
  private gameConfigFiles: Partial<Record<Game, GameConfigFile>>;
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,

    private voteService: VoteService,
    private pollService: PollService,
    private apiService: IW4MApiService,
    private gameParser: GameParserService
  ) {
    this.gameConfigFiles = this.gameParser.parseAllConfigFiles();
  }

  // Always filter by the same criteria
  // Check whether or not they start with `value` parameter
  filterValues(options: Array<string>, value: string): Array<string> {
    return options.filter(option => option.includes(value));
  }

  // TODO: dont use string use something else
  async addVote(voteValue: string, message: Message | PartialMessage, emoji: GuildEmoji | ReactionEmoji) {

    const { interaction } = message;

    const guild = this.client.guilds.cache.get(process.env.GUILD_ID_WITH_COMMANDS);

    const voiceChannels = await getVoiceChannelsByGuild(guild);
    const currentVoiceChannels = await getUserCurrentVoiceChannel(voiceChannels, interaction.user.id);

    if (currentVoiceChannels.size === 0) {
      await message.reply(
        `${tagUser(interaction as Interaction)} You must be in a voice channel to be able to vote`
      );
    }

    const currentVoiceChannel = currentVoiceChannels.at(0);

    const pendingPollForChannel = await this.pollService.get({ channelId: currentVoiceChannel.id });

    if (!pendingPollForChannel) {
      return await message.reply(`${tagUser(interaction as Interaction)} , no poll is pending for this channel`);
    }

    const hasVoted = await this.pollService.hasVoted(interaction.user.id);

    if (hasVoted) {

      // Remove reactions if user has already voted
      await message.reactions.cache
        .find(reaction => reaction.emoji.identifier === emoji.identifier)
        .users.remove(interaction.user.id);

      return await message.reply(`${tagUser(interaction as Interaction)} You can't vote twice !`);

    }

    await this.voteService.create(voteValue as any, interaction.user.id, currentVoiceChannel.id);

    // If all members have voted and percentage is not equal or higher than 50 than don't launch the command and remove the poll entry in DB
    // Check if UP votes percentage is high enough relatively to members, in that case launch the command
    const voiceChannelMembers = currentVoiceChannel.members.size;

    const upVotesPercentage = await this.pollService.getUpVotesPercentage(
      currentVoiceChannel.id, voiceChannelMembers
    );

    if (upVotesPercentage >= 50) {
      const currentPollMapName = await this.pollService.get({ channelId: currentVoiceChannel.id });
      // const mapConfig = getMapConfigByName(currentPollMapName.pollName as GameMap);
      const selectedServerGame = this.apiService.currentServer.game.toLowerCase();
      const mapConfig: GameConfigFile = this.gameParser.gameConfigFiles[selectedServerGame];
      const currentMap = mapConfig.maps.filter((mp) => mp.name === currentPollMapName.pollName)[0];

      let map: string = currentMap.filenames ?
        currentMap.filenames[currentPollMapName.gamemode]
        : currentPollMapName.pollName;

      const rawCommand = `!rcon sv_maprotation "exec zm_${currentPollMapName.gamemode}_${map}.cfg map ${currentMap.key}"`;
      console.log('Raw cmd,', rawCommand);

      this.apiService.sendCommands([rawCommand, '!rcon map_rotate']);
    }

  }

  // I just need ClientUser because the user can only vote once, so
  // If i delete his vote I'm sure that I delete his one
  async removeVote(user: ClientUser, message: Message | PartialMessage) {

    const { interaction } = message;

    const guild = this.client.guilds.cache.get(process.env.GUILD_ID_WITH_COMMANDS);

    const currentVoiceChannel = await getCurrentVoiceChannelByGuild(guild, user.id);

    await this.voteService.remove(user.id, currentVoiceChannel.id);

    const voiceChannelMembers = currentVoiceChannel.members.size;
    const upVotesPercentage = await this.pollService.getUpVotesPercentage(
      currentVoiceChannel.id, voiceChannelMembers
    );

    if (upVotesPercentage >= 50) {
      const currentPollMapName = await this.pollService.get({ channelId: currentVoiceChannel.id });
      const mapConfig = getMapConfigByName(currentPollMapName.pollName as GameMap);

      let map: string = mapConfig.filenames ?
        mapConfig.filenames[currentPollMapName.gamemode]
        : currentPollMapName.pollName;

      const rawCommand = `!rcon sv_maprotation "exec zm_${currentPollMapName.gamemode}_${map}.cfg map ${mapConfig.codeName}"`;
      // TODO: this.apiService.sendCommands([rawCommand, '!rcon map_rotate']);

      await message.reply(
        `Votes for this map reached >= 50%, switching to ${map} with gamemode ${currentPollMapName.gamemode}`
      )
    }
  }

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`);
  }

  @On('interactionCreate')
  async onIntentionCreate(interaction: AutocompleteInteraction) {
    if (interaction.isCommand()) return;

    const focusedParameter = interaction.options.getFocused(true);

    switch (focusedParameter.name) {
      case 'map': {
        const selectedServerGame = this.apiService.currentServer.game.toLowerCase();
        const gameConfig: GameConfigFile = this.gameConfigFiles[selectedServerGame];

        const filteredValues = this.filterValues(
          gameConfig.maps.map(mp => mp.name),
          focusedParameter.value.toLowerCase()
        )

        const autoCompleteList = filteredValues.map(choice => {
          return { name: translate(choice), value: choice }
        });

        await interaction.respond(autoCompleteList);
        break;
      }

      case 'gamemode': {
        const selectedServerGame = this.apiService.currentServer.game.toLowerCase();
        const gameConfig: GameConfigFile = this.gameConfigFiles[selectedServerGame];

        const currentMapValue = interaction.options.getString('map');
        const currentMap = gameConfig.maps.filter(mp => mp.name === currentMapValue).at(0);

        const filteredValues = this.filterValues(
          currentMap.gamemodes,
          focusedParameter.value
        )

        const autoCompleteList = filteredValues.map(choice => {
          return { name: choice, value: choice }
        })

        await interaction.respond(autoCompleteList);
        break;
      }

      case 'server': {
        const availableServers = this.apiService.availableServers;

        const currentUserInput = focusedParameter.value.toLowerCase();

        const filteredResults = availableServers.filter((server) => server.hostname.includes(currentUserInput));

        if (filteredResults.length === 0) return;

        const autoCompleteList = filteredResults.map(choice => {
          return { name: `${choice.hostname} - ${choice.game} - ${getGamemodeFromMap(choice.currentMap.name)}`, value: choice.id.toString() }
        })

        await interaction.respond(autoCompleteList);
        break;
      }

    }
  }

  @On('messageReactionRemove')
  async onReactionRemoved(data: MessageReaction, user: ClientUser) {

    if (data.message.interaction.commandName !== 'poll' || user.bot) return;
    await this.removeVote(user, data.message);

  }

  @On('messageReactionAdd')
  async onReactionAdded(data: MessageReaction, user: ClientUser) {

    // Ignore reactions on other message than the '/poll' one
    // TODO: how to forbid reactions on messages except for '/poll' command
    if (data.message.interaction.commandName !== 'poll' || user.bot) return;

    // Accept only two kind of emojis, check mark and red cross.
    switch (data.emoji.identifier as Emoticon) {

      case Emoticon.CheckMark: {
        this.addVote('UP', data.message, data.emoji);
        break;
      }

      case Emoticon.RedCross: {
        this.addVote('DOWN', data.message, data.emoji);
        break;
      }

      default: {
        // Not a valid emoji, this condition should never happen if I restrict emoji
        return;
      }
    }
  }
}
