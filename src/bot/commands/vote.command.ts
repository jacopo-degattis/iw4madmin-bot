import { SlashCommandPipe } from "@discord-nestjs/common";
import { Command, EventParams, Handler, InteractionEvent } from "@discord-nestjs/core";
import { ClientEvents } from "discord.js";
import { PollService } from "../models/poll/poll.service";
import { VoteCommandDto } from "../common/dtos/models/vote.dto";
import { VoteService } from "../models/vote/vote.service";
import { getClientCurrentVoiceChannel, getMapConfigByName, tagUser } from "../utils";

import { IW4MApiService } from "../modules/iw4madmin/iw4madmin.service";
import { GameMap } from "../common/enums/set-game.enum";

@Command({
  name: 'vote',
  description: 'Vote if you want change to the new map or not'
})
export class VoteCommand {

  constructor(
    private pollService: PollService,
    private voteService: VoteService,
    private apiService: IW4MApiService,
  ) { }

  @Handler()
  async onVoteCommand(
    @InteractionEvent(SlashCommandPipe) dto: VoteCommandDto,
    @EventParams() args: ClientEvents['interactionCreate']
  ) {
    const [clientEvent] = args;

    const clientCurrentVoiceChannel = await getClientCurrentVoiceChannel(clientEvent, clientEvent.user.id);

    if (clientCurrentVoiceChannel.size === 0) {
      return `${tagUser(clientEvent)} You must be in a voice channel to be able to vote`;
    }

    const hasVoted = await this.pollService.hasVoted(clientEvent.user.id);

    if (hasVoted) {
      return `${tagUser(clientEvent)} You can't vote twice !`
    }

    // Get the first value, user can't be in two voice channel simultaneously
    // And i know that there is at least one because of control line 35
    const voiceChannel = clientCurrentVoiceChannel.at(0);

    if (!(await this.pollService.get({ channelId: voiceChannel.id }))) {
      return `${tagUser(clientEvent)}, no poll is pending for this channel`
    }

    await this.voteService.create(dto.votez as any, clientEvent.user.id, voiceChannel.id);

    // If all members have voted and percentage is not equal or higher than 50 than don't launch the command and remove the poll entry in DB
    // Check if UP votes percentage is high enough relatively to members, in that case launch the command
    const voiceChannelMembers = voiceChannel.members.size;

    const upVotesPercentage = await this.pollService.getUpVotesPercentage(
      voiceChannel.id, voiceChannelMembers
    );

    if (upVotesPercentage >= 50) {
      const currentPollMapName = await this.pollService.get({ channelId: voiceChannel.id });
      const mapConfig = getMapConfigByName(currentPollMapName.pollName as GameMap);

      let map: string = mapConfig.filenames ?
        mapConfig.filenames[currentPollMapName.gamemode]
        : currentPollMapName.pollName;

      const rawCommand = `!rcon sv_maprotation "exec zm_${currentPollMapName.gamemode}_${map}.cfg map ${mapConfig.codeName}"`;
      this.apiService.sendCommands([rawCommand, '!rcon map_rotate']);

      // TODO: in this case return 'thank you your vote has been registerd etc.'
      // and also send a message notifying the user that the map and the gamemode is going
      // to be changed ASAP
    }

    return `Thank you ${tagUser(clientEvent)}, your vote has been registered !`
  }

}