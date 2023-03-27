import {Message} from "discord.js";
import {SlashCommand} from "../types";

export const command: SlashCommand = {
    category: "fun",
    description: "reagir à une commande",
    name: "react",
    usage: "/react",

    execute: async (interaction) => {
        const message: Message = await interaction.reply({
            content: 'Message avec réaction',
            fetchReply: true
        })

        await message.react('👍');
    }
}