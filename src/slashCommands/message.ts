import {EmbedBuilder} from "discord.js";
import {SlashCommand} from "../types";
import {SlashCommandBuilder} from "discord.js";

export const command: SlashCommand = {
    name: 'message',
    data : new SlashCommandBuilder()
        .setName('message')
        .setDescription('Affiche le ping du bot')
        .addStringOption((option) => {
            return option
                .setName('message')
                .setDescription('Message à afficher')
                .setRequired(true);
        }),
    execute: async (interaction) => {
        const message = interaction.options.get('message').value.toString();
        await interaction.reply({content: `Valeur du message: ${message}`});
    }
}