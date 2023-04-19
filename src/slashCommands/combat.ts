import {SlashCommand} from "../types";
import {CommandInteraction} from "discord.js";

export const command: SlashCommand = {
    name: "combat",
    usage: "",
    category: "gameplay",
    description: "Permet de lancer un combat",
    execute(interaction: CommandInteraction): Promise<any> {

    return Promise.resolve(undefined);
    }

}

