import {SlashCommand} from "../types";

export const command: SlashCommand = {
    category: "fun",
    description: "envoie un message",
    name: "message",
    usage: "/message",
    options: [
        {type: 'STRING', name: 'message', description: 'Message à envoyer', required: true, autocomplete: false}
    ],

    execute: async (interaction) => {
        const message = interaction.options.get('message').value.toString();
        if (message === '%pos%') await interaction.reply({content: `Vend code audio\nNO ARNAK NO NOOB\nRDV Zaap Astrub`});
        else await interaction.reply({content: `Valeur du message: ${message}`});
    }
}