import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, EventParams, Handler, InteractionEvent } from "@discord-nestjs/core";
import { ClientEvents } from 'discord.js';
import { SetGameDto } from '../dtos/set-game.dto';
import { IW4MApiService } from '../api.service';
import { getMapConfigByName, translate } from '../utils';

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
        let mapConfig = getMapConfigByName(dto.map);

        let map: string = mapConfig.filenames ?
                mapConfig.filenames[dto.gamemode]
            : dto.map;

        const rawCommand = `!rcon sv_maprotation "exec zm_${dto.gamemode}_${map}.cfg map ${mapConfig.codeName}"`;
        
        this.apiService.sendCommands([rawCommand, '!rcon map_rotate']);
        
        // TODO:
        // Return the following message only if the command goes without errors
        // Otherwise return an error always tagging the user that requested it
        return `<@${args[0].user.id}> I'm switching to map "${translate(dto.map)}" with gamemode "${dto.gamemode}"`;
    }
}