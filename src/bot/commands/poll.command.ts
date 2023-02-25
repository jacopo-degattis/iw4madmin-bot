import { SlashCommandPipe } from '@discord-nestjs/common';
import { SetGameDto } from '../common/dtos/commands/set-game.dto';
import { Client, ClientEvents, PermissionFlagsBits } from 'discord.js';
import { Command, EventParams, Handler, InjectDiscordClient, InteractionEvent } from "@discord-nestjs/core";

import { PollService } from '../models/poll/poll.service';
import { Emoticon } from '../common/enums/emoji.enum';
import { GenericException, getClientCurrentVoiceChannel, getCurrentBotTextChannel, tagUser, translate } from '../utils';

@Command({
  name: 'poll',
  description: 'Create a poll for the new map and gamemode',
})
export class PollCommand {

  constructor(
    private pollService: PollService,

    @InjectDiscordClient()
    private readonly client: Client,
  ) { }

  @Handler()
  async onPollCommand(
    @InteractionEvent(SlashCommandPipe) dto: SetGameDto,
    @EventParams() args: ClientEvents['interactionCreate']
  ) {
    const [clientEvent] = args;

    if (!clientEvent.isRepliable()) throw new GenericException('onPollCommand(): Interaction is not repliable');

    const clientCurrentVoiceChannel = await getClientCurrentVoiceChannel(clientEvent, clientEvent.user.id);

    if (clientCurrentVoiceChannel.size === 0) return `${tagUser(clientEvent)}, you must be inside a voice channel to start a poll !`;

    const currentVoiceChannel = clientCurrentVoiceChannel.at(0);

    const alreadyExists = await this.pollService.exists(currentVoiceChannel.id, dto.map, dto.gamemode);

    if (alreadyExists) {
      return `<@${clientEvent.user.id}> A polling for this map with the given gamemode is already pending in this channel`
    }

    await this.pollService.createAndReplace({
      channelId: currentVoiceChannel.id,
      pollName: dto.map,
      gamemode: dto.gamemode,
      votes: []
    })

    // NOTE: rn the bot takes the 'votes' channel the one where it is invoked the first time
    const currTextChannel = await getCurrentBotTextChannel(clientEvent);
    const hasPermission = currTextChannel.permissionOverwrites.cache.get(currTextChannel.guild.id)

    // Remove 'ADD_REACTIONS' permission only if it's not already there
    if (!(hasPermission.deny.has(PermissionFlagsBits.AddReactions))) {
      await currTextChannel.permissionOverwrites.edit(clientEvent.guild.roles.everyone.id, { AddReactions: false });
    }

    const responseMessage = await clientEvent.reply({
      content: `${tagUser(clientEvent)}, a poll for map "${translate(dto.map)}" with gamemode "${dto.gamemode}" is being created.\nEveryone should vote !`,
      fetchReply: true,
    })

    await responseMessage.react(Emoticon.CheckMark);
    await responseMessage.react(Emoticon.RedCross);

  }
}
