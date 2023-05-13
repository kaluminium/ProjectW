import {SlashCommand} from "../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    MessageComponentInteraction
} from "discord.js";
import {Compte} from "../models/Compte";
import {Personnage} from "../models/Personnage";
import {ListePersonnage} from "../models/ListePersonnage";
import {De} from "../models/De";
import {combatLogic} from "../combatLogic";
import {Monstre} from "../models/Monstre";


export const command: SlashCommand = {
    name: "combat",
    usage: "",
    category: "gameplay",
    description: "Permet de lancer un combat",

    execute: async (interaction) => {
        let compte: Compte;

        //region ------ VERIFICATIONS VALIDITE COMMANDE ------
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

        //region ------ MISE EN PLACE MONSTRE ET JOUEUR ------
        //Une partie de la logique de combat est placée dans le script "combatLogic.ts", toutefois c'est une classe static donc c'est tout de même
        //la fonction de combat qui gérera les variables (Arrays de dés)
        const listeDe : Array<De> = selectedPersonnage.creationDice();

        //Création du monstre
        //Valeur hardcodées dans le constructeur pour rendre la démo plus simple
        //TODO toujours un problème de création
        //const monstre : Monstre = new Monstre("gobelin", "normal");
        //endregion

        //region ------ MISE EN PLACE EMBED ------
        //TODO créer un bouton de lancement de combat pour lancer la boucle

        //region ------ CREATION CHAMPS ------
        let t = 1;

        let deDuTour = combatLogic.choixDeDuTour(listeDe);
        let deLancesDuTour = combatLogic.lancerDeDuTour(deDuTour);
        let deDuTourDescription = deLancesDuTour.map(([num, str], index) => `${num}${str}`).join("; ")

        let fieldPvJoueur = {name : 'Pv du joueur : ', value : 'selectedPersonnage.getPV()'};
        let fieldPvMonstre = {name : 'Pv du Monstre : ', value : 'monstre.getPV()'};
        let fieldDeDuTour = {name : 'Dés du tour : ', value : 'Dés : ' +deDuTourDescription};

        const embed : EmbedBuilder = new EmbedBuilder()
            .setTitle('Combat Tour '+t)
            .setDescription('Vous affrontez un ')//TODO Ajoutez le getName() du Monstre mais pour l'instant la création de Monstre bug
            .addFields(
                fieldPvJoueur,
                fieldPvMonstre,
                fieldDeDuTour,
                {name : 'Sort 1 : ', value : 'listeSort["spell1"].description + listeSort.cout'},
                {name : 'Sort 2 : ', value : 'listeSort["spell2"].description + listeSort.cout'},
                {name : 'Sort 3 : ', value : 'listeSort["spell3"].description + listeSort.cout'},
                {name : 'Sort 4 : ', value : 'listeSort["spell4"].description + listeSort.cout'}
        );

        //endregion

        //region ------ CREATION BOUTONS SORTS ------
        const spellRow  = new ActionRowBuilder<any>()
        for (let j = 1; j <= 4; j++){
            spellRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`spell_`+j)
                    .setLabel(`Spell `+j)
                    .setStyle(ButtonStyle.Danger)
            )
        }
        //bouton de passage de tour
        spellRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`passe_tour`)
                .setLabel(`Passer Tour`)
                .setStyle(ButtonStyle.Secondary)
        )

        //endregion

        //endregion

        //region ------ BOUCLE DE COMBAT ------

        //while (t <= 5){ //TODO boucle sur i < 5 pour test et débug mais à terme bouclera sur les pv du joueurs et monstre

        let reponse = await interaction.reply({
            embeds: [embed],
            components: [spellRow]
        });
        //region ------ COLLECTOR ------
                //TODO : Appel de la fonction nécessaire
                //Vérifie quel sort a été lancé puis déclenche les actions nécessaires (appel de la fonction de dmg du sort)
                // + appel de la fonction de prise du dmg du monstre
                const collector = reponse.createMessageComponentCollector({time: 600000});

                collector.on('collect', async (i) => {
                    if(i.member.user.id !== interaction.member.user.id) return;
                    switch (i.customId){
                        case "spell_1" :
                            await i.update({
                                content: `Vous avez lancer le sort 1, le ` + 'monstre.getName()' + 'prend ' + 'calculdmg' + 'dégâts',
                                components: [],
                                embeds: []
                            });
                            break;

                        case "spell_2" :
                            await i.update({
                                content: `Vous avez lancer le sort 2, le`  + 'monstre.getName()' + 'prend ' + 'calculdmg' + 'dégâts',
                                components: [],
                                embeds: []
                            });
                            break;

                        case "spell_3" :
                            await i.update({
                                content: `Vous avez lancer le sort 3, le`  + 'monstre.getName()' + 'prend ' + 'calculdmg' + 'dégâts',
                                components: [],
                                embeds: []
                            });
                            break;

                        case "spell_4" :
                            await i.update({
                                content: `Vous avez lancer le sort 4, le`  + 'monstre.getName()' + 'prend ' + 'calculdmg' + 'dégâts',
                                components: [],
                                embeds: []
                            });
                            break;

                        case "passe_tour" :
                            console.log("passe tour avant");
                            await i.update({
                                content: `Vous avez passer votre tour`,
                                components: [],
                                embeds: []
                            });
                            t++; //TODO toute logique de passage de tour doit être ajoutée ici
                            console.log("passe tour après");
                            break;
                    }
                    collector.stop();
                })

                //TODO rajouter la "défaite" du joueur dans ce bloc pour éviter que les joueurs évitent les défaites en partant AFK
                //Bloc qui se déclenche si le joueur reste AFK 10 minutes et mets fin au combat
                collector.on('end', async (i: MessageComponentInteraction, reason) => {
                    if(reason === 'time'){
                        await reponse.delete();
                        collector.stop();
                    }
                })
                //endregion

        //}
        //endregion



    }

}

