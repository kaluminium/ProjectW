import {EmbedBuilder, Message} from "discord.js";
import {SlashCommand} from "../types";
import {SlashCommandBuilder} from "discord.js";

export const command: SlashCommand = {
    name: 'react',
    data : new SlashCommandBuilder()
        .setName('react')
        .setDescription('Envoie un message avec une réaction'),
    execute: async (interaction) => {
        const message: Message = await interaction.reply({
            content: 'Message avec réaction',
            fetchReply: true
        })

        await message.react('👍');
    }
}