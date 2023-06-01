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
import {Compte} from "../models/Compte";
import {ListePersonnage} from "../models/ListePersonnage";
import {Equipment} from "../models/Equipment";
import {Arme} from "../models/Equipement/Arme";
import {Armure} from "../models/Equipement/Armure";
import {Bouclier} from "../models/Equipement/Bouclier";

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

        //region ------ VERIFICATIONS VALIDITE COMMANDE ------

        let compte: Compte;
        //Récupère le compte du joueur
        //Erreur(s) possible :
        //- L'utilisateur n'a pas de compte : gérée, indique à l'utilisateur qu'il n'a pas de compte et lui propose d'en créer un
        try {
            compte = await Compte.getAccount(interaction.user.id)
        } catch (e) {
            return await interaction.reply({
                content: `Vous n'avez pas de compte, faites /creation_compte pour créer un compte`,
                ephemeral: true
            });
        }
        //Récupère la liste de personnages du compte
        //Puis vérifie que l'utilisateur a des personnages, sinon lui propose d'en créer un puis de le sélectionner
        const listePersonnages : ListePersonnage = await compte.getListPersonnage();
        if(listePersonnages.isEmpty()) return await interaction.reply({
            content: `Vous n'avez pas de personnage, faites /creation_personnage pour créer un personnage,
            \npuis /select_personnage pour sélectionner un personnage`,
            ephemeral: true
        });

        //Récupère le personnage sélectionné du compte
        //Puis vérifie que l'utilisateur a un personnage sélectionné, sinon lui propose d'en sélectionner un
        const selectedPersonnage : Personnage = await compte.getSelectedPersonnage();
        if(selectedPersonnage == null) return await interaction.reply({
            content: `Vous n'avez pas de personnage sélectionné, faites /select_personnage pour sélectionner un personnage`,
            ephemeral: true
        });
        //endregion

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
                if (await Forgeron.verificationSiRessourcesDisponible(id[index], selectedPersonnage)) {
                    if (await Forgeron.verificationDuLvl(required_level[index], selectedPersonnage)) {
                        await Forgeron.retraitDesRessouces(id[index], selectedPersonnage);
                        await Forgeron.ajoutExperience(xp[index], selectedPersonnage);

                        let idSansRecipe : string = id[index].replace("_recipe", "");
                        console.log("idSansRecipe sans recipe "+idSansRecipe);
                        let typeDequipement : string = Equipment.typeEquipement(idSansRecipe);
                        console.log("Type de quipememnt "+typeDequipement);
                        console.log("id Index : "+id[index]);
                        let stuffCraft : Arme | Armure | Bouclier = new Bouclier(idSansRecipe);
                        if (typeDequipement == "weapon") {
                            let stuffCraft :Arme = new Arme(idSansRecipe);
                        }
                        if (typeDequipement == "armor") {
                            let stuffCraft :Armure = new Armure(idSansRecipe);
                        }
                        if (typeDequipement == "shield") {
                            let stuffCraft : Bouclier = new Bouclier(idSansRecipe);
                        }

                        let stuff: Equipment = new Equipment(selectedPersonnage,stuffCraft.getIda(),stuffCraft.getHp(),
                            stuffCraft.getAttack(),0,0,0,stuffCraft.getDefense());
                        await Equipment.addEquipmentBDD(stuff);
                        await i.reply('Bravo, vous avez réussi la fabrication de : '+nom[index])

                    } else {
                        await i.reply('Vous n\'avez pas le niveau requis pour fabriquer : '+nom[index])
                    }
                } else {
                    await i.reply('Vous n\'avez pas les ressource requise pour fabriquer : '+nom[index])
                }






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
