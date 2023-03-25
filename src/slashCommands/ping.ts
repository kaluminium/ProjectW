import {EmbedBuilder} from "discord.js";
import {SlashCommand} from "../types";
import {SlashCommandBuilder} from "discord.js";

export const command: SlashCommand = {
    name: 'ping',
    data : new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche le ping du bot'),
    execute: async (interaction) => {
        await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({name: 'kaluminium'})
                        .setDescription(`pong\nPing: ${interaction.client.ws.ping}`)
                        .setColor('#ff8e4d')
                ]
            });
    }
}