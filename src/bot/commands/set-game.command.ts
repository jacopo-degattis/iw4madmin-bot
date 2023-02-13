import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, EventParams, Handler, InteractionEvent } from "@discord-nestjs/core";
import { ClientEvents } from 'discord.js';
import { SetGameDto } from '../dtos/set-game.dto';
import { IW4MApiService } from '../api.service';

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
        let rawCommand = `sv_maprotation exec zm_${dto.gamemode}_${dto.map}.cfg zm_${dto.map}`;
        
        // TODO: currently not working
        // Need to add authorization with token (just for dev purposes)
        this.apiService.sendCommand(rawCommand).subscribe(response => {
            console.log(response.status)
            console.log(response.data);
        });

        return 'NOT IMPLEMENTED'
    }
}