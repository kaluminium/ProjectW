import { Personnage } from "../models/Personnage";
import { SlashCommand } from "../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder, MessageComponentInteraction,
    TextInputBuilder
} from 'discord.js';
import { Forgeron } from "../models/MetierCraft/Forgeron";

export const command: SlashCommand = {
    category: "metier",
    description: "command pour voir et creer les equipements de forgeron",
    name: "forgeron",
    usage: "craft",

    execute: async (interaction: CommandInteraction) => {

        let id: Array<string> = Forgeron.listeDinformation("id");
        let nom: Array<string> = Forgeron.listeDinformation("nom");
        let metier: Array<string> = Forgeron.listeDinformation("metier");
        let required_level: Array<string> = Forgeron.listeDinformation("required_level");
        let xp: Array<string> = Forgeron.listeDinformation("Xp");
        let index: number = 0;

        // Création de l'embed
        const embed = new EmbedBuilder()
            .setTitle("Livre de recette du métier de : "+metier[index])
            .setDescription("Liste des recettes")
            .addFields(
                {name: '__Recette : __', value:`${nom[index]}` , inline: true},
                {name: '__Niveau requis : __', value:`${required_level[index]}` , inline: true},
                {name: '__Experience gagnée : __', value: `${xp[index]}`, inline: true},
                {name: '__Ressources requises : __', value: `${Forgeron.ressourceRequiseId(id[index])}`, inline: false},
            )
            .setColor("#00ff00")

        // Création des boutons
        const buttonRow = new ActionRowBuilder<any>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("⬅️")
                    .setCustomId("button_previous"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("➡️")
                    .setCustomId("button_next"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("❌")
                    .setCustomId("button_close"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🔨")
                    .setCustomId("craft")
                    );

        let reponse = await interaction.reply({
            embeds: [embed],
            components: [buttonRow]
        });


        const collector = reponse.createMessageComponentCollector({time: 360000});
        collector.on('collect', async (i) => {
            if (i.member.user.id !== interaction.member.user.id) return;
            if (i.customId === 'button_previous') {
                if (index === 0) {
                    index = id.length - 1;
                } else {
                    index--;
                }
                const embed = new EmbedBuilder()
                    .setTitle("Livre de recette du métier de : "+metier[index])
                    .setDescription("Liste des recettes")
                    .addFields(
                        {name: '__Recette : __', value:`${nom[index]}` , inline: true},
                        {name: '__Niveau requis : __', value:`${required_level[index]}` , inline: true},
                        {name: '__Experience gagnée : __', value: `${xp[index]}`, inline: true},
                        {name: '__Ressources requises : __', value: `${Forgeron.ressourceRequiseId(id[index])}`, inline: false},
                    )
                    .setColor("#00ff00")
                await i.update({
                    embeds: [embed]
                });
            }
            if (i.customId === 'button_next') {
                if (index === id.length - 1) {
                    index = 0;
                } else {
                    index++;
                }
                const embed = new EmbedBuilder()
                    .setTitle("Livre de recette du métier de : "+metier[index])
                    .setDescription("Liste des recettes")
                    .addFields(
                        {name: '__Recette : __', value:`${nom[index]}` , inline: true},
                        {name: '__Niveau requis : __', value:`${required_level[index]}` , inline: true},
                        {name: '__Experience gagnée : __', value: `${xp[index]}`, inline: true},
                        {name: '__Ressources requises : __', value: `${Forgeron.ressourceRequiseId(id[index])}`, inline: false},
                    )
                    .setColor("#00ff00")
                await i.update({
                    embeds: [embed]
                });
            }
            if (i.customId === 'button_close') {
                await reponse.delete();
                collector.stop();
            }
            if (i.customId === 'craft') {

                await i.reply('Bravo, vous avez réussi la fabrication de : '+nom[index]);
            }
        });



        collector.on('end', async (i: MessageComponentInteraction, reason) => {
            if(reason === 'time'){
                await reponse.delete();
                collector.stop();
            }
        })
    }
};
