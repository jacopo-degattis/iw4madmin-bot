import { SlashCommandPipe } from '@discord-nestjs/common';
import { Command, EventParams, Handler, InteractionEvent } from "@discord-nestjs/core";
import { ClientEvents } from 'discord.js';
import { SetGameDto } from '../dtos/set-game.dto';

@Command({
    name: 'set-game',
    description: 'Set map and gametype',
})
export class SetGameCommand {
    @Handler()
    onSetGameCommand(
        @InteractionEvent(SlashCommandPipe) dto: SetGameDto,
        @EventParams() args: ClientEvents['interactionCreate']
    ) {
        console.log('DTO => ', dto.map, dto.gamemode);
        // console.log('Event args => ', args)
        
        return 'NOT IMPLEMENTED'
    }
}