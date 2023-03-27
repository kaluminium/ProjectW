import {SlashCommand} from "../types";

export const command: SlashCommand = {
    category: "fun",
    description: "envoie un message",
    name: "message",
    usage: "/message",
    options: [
        {type: 'STRING', name: 'message', description: 'Message à envoyer', required: true}
    ],

    execute: async (interaction) => {
        const message = interaction.options.get('message').value.toString();
        await interaction.reply({content: `Valeur du message: ${message}`});
    }
}