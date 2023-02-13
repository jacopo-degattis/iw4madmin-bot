import { CommandInteractionOptionResolver } from "discord.js";

export interface IAutoCompleteInteraction {
    options: CommandInteractionOptionResolver
}