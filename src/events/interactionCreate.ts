import {Events, Interaction} from "discord.js";
import {BotEvent} from "../types";

const event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand()){
            const command = interaction.client.slashCommands.get(interaction.commandName);

            if (!command) return;
            try{
                await command.execute(interaction);
            }catch (error){
                console.error(error);
            }
        }else if (interaction.isAutocomplete()) {

            const command = interaction.client.slashCommands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }

    }
}

export default event;