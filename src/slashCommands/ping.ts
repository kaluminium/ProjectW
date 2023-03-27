import {EmbedBuilder} from "discord.js";
import {SlashCommand} from "../types";

export const command: SlashCommand = {
    name: 'ping',
    description: 'Ping!',
    category: 'misc',
    usage: 'ping',

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