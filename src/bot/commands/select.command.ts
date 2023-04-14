import { Command, EventParams, Handler, InteractionEvent } from "@discord-nestjs/core";
import { IW4MApiService } from "../modules/iw4madmin/iw4madmin.service";
import { SlashCommandPipe } from "@discord-nestjs/common";
import { ClientEvents } from "discord.js";
import { SelectServerDto } from "../common/dtos/commands/select-server.dto";

@Command({
  name: 'select-server',
  description: 'Select the server you want to send command to'
})
export class SelectServerCommand {

  constructor(
    private iw4mApi: IW4MApiService
  ) { }

  @Handler()
  async onSelectServerCommand(
    @InteractionEvent(SlashCommandPipe) dto: SelectServerDto,
    @EventParams() args: ClientEvents['interactionCreate']
  ) {
    this.iw4mApi.currentServer.id = parseInt(dto.server);

    console.log(this.iw4mApi.currentServer);

    return `Server changed to ${dto.server}`;
  }

}