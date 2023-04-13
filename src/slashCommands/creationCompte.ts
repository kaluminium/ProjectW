import {SlashCommand} from "../types";
import {
    ActionRowBuilder,
    CommandInteraction, MessageComponentInteraction,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder, TextInputStyle,
    StringSelectMenuBuilder, Embed, EmbedBuilder
} from "discord.js";
import {Compte} from "../models/Compte";

export const command : SlashCommand = {
    name: "creation_compte",
    usage: "creation_compte",
    category: "account",
    description: "permet de créer un compte",
    execute : async (interaction: CommandInteraction) => {
        const modal = new ModalBuilder()
            .setCustomId('accountCreationModal')
            .setTitle('Creation de compte');

        const usernameInput = new TextInputBuilder()
            .setCustomId('usernameInput')
            .setStyle(TextInputStyle.Short)
            .setLabel("Quel est votre nom d'utilisateur?")
            .setPlaceholder("Ex: kaluminium")
            .setMinLength(3)
            .setMaxLength(30)
            .setRequired(true)

        const mailInput = new TextInputBuilder()
            .setCustomId('mailInput')
            .setStyle(TextInputStyle.Short)
            .setLabel("Quel est votre mail?")
            .setPlaceholder("Ex: kaluminium@projetw.fr")
            .setRequired(true)

        const passwordInput = new TextInputBuilder()
            .setCustomId('passwordInput')
            .setStyle(TextInputStyle.Short)
            .setLabel("Mettez votre mot de passe")
            .setPlaceholder("Ex : Kaluminium1234!")
            .setMinLength(8)
            .setMaxLength(30)
            .setRequired(true)

        const usernameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(usernameInput);
        const passwordActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(passwordInput);
        const mailActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(mailInput);

        modal.addComponents(usernameActionRow, mailActionRow, passwordActionRow);

        await interaction.showModal(modal);

        const myfilter = i=> i.customId === 'accountCreationModal' && i.user.id === interaction.user.id;

        const submitted = await interaction.awaitModalSubmit({time: 50000, filter : myfilter}).catch(() => {return null});

        if (submitted) {
            const username = submitted.fields.getTextInputValue('usernameInput');
            const mail = submitted.fields.getTextInputValue('mailInput');
            const password = submitted.fields.getTextInputValue('passwordInput');

            try {
                let id : number = await Compte.register(
                    interaction.member.user.id,
                    username,
                    password,
                    mail)

                const embed = new EmbedBuilder()
                    .setTitle('Compte créé !')
                    .setDescription(`Bienvenue à toi sur projetW, ${username} !\n`
                    +`Tu peux désormais créer tes personnages et les gérer grâce à la commande \`/creation_personnage\` !`)
                    .setColor('#00ff00')
                    .setFooter({
                        text: `Ton id de compte est ${id}. Tu peux le retrouver dans la commande /mon_compte`
                    })
                await submitted.reply({embeds : [embed], ephemeral: true});
            }
            catch (e) {
                await submitted.reply({content: `Erreur lors de la création du compte : ${e.message}`, ephemeral: true});
            }
        }
    }
}