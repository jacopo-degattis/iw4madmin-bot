import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, EventParams, Handler, InteractionEvent } from "@discord-nestjs/core";
import { ClientEvents } from 'discord.js';
import { SetGameDto } from '../common/dtos/commands/set-game.dto';
import { getClientCurrentVoiceChannel, getMapConfigByName, tagUser, translate } from '../utils';
import { PollService } from '../models/poll/poll.service';

@Command({
  name: 'set-game',
  description: 'Set map and gametype',
})
export class SetGameCommand {

  constructor(
    private pollService: PollService,
  ) { }

  @Handler()
  async onSetGameCommand(
    @InteractionEvent(SlashCommandPipe) dto: SetGameDto,
    @EventParams() args: ClientEvents['interactionCreate']
  ) {
    const [clientEvent] = args;

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

    // TODO:
    // Return the following message only if the command goes without errors
    // Otherwise return an error always tagging the user that requested it

    // This message sould be returned if 'vote' options is skipped (feature still to be developed TODO:)
    // return `<@${args[0].user.id}> I'm switching to map "${translate(dto.map)}" with gamemode "${dto.gamemode}"`;

    return `${tagUser(clientEvent)}, a poll for map "${translate(dto.map)}" with gamemode "${dto.gamemode}" is being created.\nEveryone should vote !`
  }
}
