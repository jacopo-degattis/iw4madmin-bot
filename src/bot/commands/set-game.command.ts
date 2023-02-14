import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, EventParams, Handler, InteractionEvent } from "@discord-nestjs/core";
import { ClientEvents } from 'discord.js';
import { SetGameDto } from '../dtos/set-game.dto';
import { IW4MApiService } from '../api.service';
import { getMapConfigByName } from '../utils';

@Command({
    name: 'set-game',
    description: 'Set map and gametype',
})
export class SetGameCommand {

    constructor(
        private apiService: IW4MApiService
    ) { }
 
    @Handler()
    onSetGameCommand(
        @InteractionEvent(SlashCommandPipe) dto: SetGameDto,
        @EventParams() args: ClientEvents['interactionCreate']
    ) {
        
        let rawCommand: string = "";
        let mapConfig = getMapConfigByName(dto.map);

        if (mapConfig.filenames) {
            rawCommand = `!rcon sv_maprotation "exec zm_${dto.gamemode}_${mapConfig.filenames[dto.gamemode]}.cfg map ${mapConfig.codeName}"`;
        } else {
            rawCommand = `!rcon sv_maprotation "exec zm_${dto.gamemode}_${dto.map}.cfg map ${mapConfig.codeName}"`;
        }

        if (!rawCommand) {
            console.log('No raw command leaving...')
            // Handle error, return for now
            return;
        }
        
        // TODO: Improve .sendCommand method code
        this.apiService.sendCommands([rawCommand, '!rcon map_rotate']);

        return `Switching to map ${dto.map} with gamemode ${dto.gamemode}`;
    }
}