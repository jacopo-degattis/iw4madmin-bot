import { InjectDiscordClient, On, Once } from "@discord-nestjs/core";
import { Injectable, Logger } from "@nestjs/common";
import { AutocompleteInteraction, Client, Message } from "discord.js";

import { GameMap } from "./enums/set-game.enum";
import { getAvailableModesByMap, translate } from "./utils";

@Injectable()
export class BotGateway {
    private readonly logger = new Logger(BotGateway.name);

    constructor(
        @InjectDiscordClient()
        private readonly client: Client
    ) { }

    // Always filter by the same criteria
    // Check whether or not they start with `value` parameter
    filterValues(options: Array<string>, value: string): Array<string> {
        return options.filter(option => option.includes(value));
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
                const options = Object.values(GameMap);    
                const filteredValues = this.filterValues(options, focusedParameter.value.toLowerCase());
    
                const autoCompleteList = filteredValues.map(choice => {
                    return { name: translate(choice), value: choice }
                });
    
                await interaction.respond(autoCompleteList);
                break;
            }

            case 'gamemode': {
                const currentMapValue: GameMap = interaction.options.getString('map') as GameMap;
            
                const options = getAvailableModesByMap(currentMapValue);
                
                const filteredValues = this.filterValues(options, focusedParameter.value);
    
                const autoCompleteList = filteredValues.map(choice => {
                    return { name: choice, value: choice }
                })
    
                await interaction.respond(autoCompleteList);
                break;
            }
        }
    }
}
