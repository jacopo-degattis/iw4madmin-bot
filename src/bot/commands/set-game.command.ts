import { SlashCommandPipe } from "@discord-nestjs/common";
import { Command, EventParams, Handler, InteractionEvent } from "@discord-nestjs/core";
import { SetGameDto } from "../common/dtos/commands/set-game.dto";
import { ClientEvents, GuildMember, GuildMemberRoleManager, Role } from "discord.js";
import { getMapConfigByName, memberHasRole, tagUser } from "../utils";
import { IW4MApiService } from "../modules/iw4madmin/iw4madmin.service";
import { Roles } from "../common/enums/roles.enum";

@Command({
  name: 'set-game',
  description: 'Directly set new map and gamemode'
})
export class SetGameCommand {

  constructor(
    private apiService: IW4MApiService
  ) { }

  @Handler()
  async onSetGameCommand(
    @InteractionEvent(SlashCommandPipe) dto: SetGameDto,
    @EventParams() args: ClientEvents['interactionCreate']
  ) {

    const [clientEvent] = args;

    if (!clientEvent.isCommand()) return;

    const currentMember: GuildMember = clientEvent.member as GuildMember;

    console.log('Checking role ', Roles.COMMANDER);

    if (!(await memberHasRole(Roles.COMMANDER, currentMember))) {
      return `${tagUser(clientEvent)}, you don't have the role necessary to execute this command`
    }

    const mapConfig = getMapConfigByName(dto.map);

    let map: string = mapConfig.filenames ?
      mapConfig.filenames[dto.gamemode]
      : dto.map;

    const rawCommand = `!rcon sv_maprotation "exec zm_${dto.gamemode}_${map}.cfg map ${mapConfig.codeName}"`;
    this.apiService.sendCommands([rawCommand, '!rcon map_rotate']);

    return `Skipping vote and setting map ${map} with gamemode ${dto.gamemode}`;
  }
}