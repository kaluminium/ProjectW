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

    //TODO Commentaire rajouter juste parce que j'ai troller sur mon commit précédent
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
        let tourPasse = false;

        let deDuTour = combatLogic.choixDeDuTour(listeDe);
        let deLancesDuTour = combatLogic.lancerDeDuTour(deDuTour);
        let deDuTourDescription = deLancesDuTour.map(([num, str], index) => `${num}${str}`).join("; ")
        let pvDuMonstre = 100;//TODO Temporaire, pour le debug
        let pvDuJoueur = 150;

        let fieldPvJoueur = {name : 'Pv du joueur : ', value : pvDuJoueur.toString()};
        let fieldPvMonstre = {name : 'Pv du Monstre : ', value : pvDuMonstre.toString()};
        let fieldDeDuTour = {name : 'Dés du tour : ', value : 'Dés : ' +deDuTourDescription};

        //TODO à mettre dans une boucle for, surement dans celle de création des boutons ?
        let fieldSort1 = {name : 'Sort 1 : ', value : 'listeSort["spell1"].description + listeSort.cout'};
        let fieldSort2 = {name : 'Sort 2 : ', value : 'listeSort["spell2"].description + listeSort.cout'};
        let fieldSort3 = {name : 'Sort 3 : ', value : 'listeSort["spell3"].description + listeSort.cout'};
        let fieldSort4 = {name : 'Sort 4 : ', value : 'listeSort["spell4"].description + listeSort.cout'};

        const embed : EmbedBuilder = new EmbedBuilder()
            .setTitle('Combat Tour '+t)
            .setDescription('Vous affrontez un ')//TODO Ajoutez le getName() du Monstre mais pour l'instant la création de Monstre bug
            .addFields(
                fieldPvJoueur,
                fieldPvMonstre,
                fieldDeDuTour,
                fieldSort1,
                fieldSort2,
                fieldSort3,
                fieldSort4
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

        let reponse = await interaction.reply({
            embeds: [embed],
            components: [spellRow]
        });

        //region ------ COLLECTOR ------
                //Vérifie quel sort a été lancé puis déclenche les actions nécessaires (appel de la fonction de dmg du sort)
                // + appel de la fonction de prise du dmg du monstre
                const collector = reponse.createMessageComponentCollector({time: 600000});

                collector.on('collect', async (i) => {
                    if (i.member.user.id !== interaction.member.user.id) return;

                    //region ------ GESTION DES BOUTONS ------
                    switch (i.customId) {
                        case "spell_1" :
                            //TODO c'est là que y aura le try/catch comme ça les dmg sont mis et les dé supprimés seulement si le sort se lance
                            //Maj des pv du monstre
                            pvDuMonstre -= 20;//TODO là ça serait un monstre.getPV

                            //Maj des dés du tour
                            deLancesDuTour.splice(0, 3);
                            deDuTourDescription = deLancesDuTour.map(([num, str], index) => `${num}${str}`).join("; ");

                            break;

                        case "spell_2" :
                            break;

                        case "spell_3" :
                            break;

                        case "spell_4" :
                            break;

                        case "passe_tour" :
                            tourPasse = true;
                            break;
                    }
                    //endregion

                    //region ------ MISE A JOUR EMBED ------
                    if (pvDuMonstre > 0 && pvDuJoueur > 0){//TODO Remplacer par les getPV()

                        //region ------ TOUR DU MONSTRE ------
                        if (deLancesDuTour.length === 0 || tourPasse) {

                            //remet tourPasse à false au cas où le joueur ait passé son tour
                            tourPasse = false;
                            t++;

                            console.log("Tour du Monstre");
                            pvDuJoueur -= 25;//TODO là ça sera l'attaque du monstre en fait

                            //regiond ------ LANCEMENT NOUVEAUX DÉS ------
                            deDuTour = combatLogic.choixDeDuTour(listeDe);
                            deLancesDuTour = combatLogic.lancerDeDuTour(deDuTour);
                            deDuTourDescription = deLancesDuTour.map(([num, str], index) => `${num}${str}`).join("; ")

                            //endregion
                        }
                        //endregion

                        //region ------ MISE A JOUR DES CHAMPS ------

                        //Met le champ des PV du joueur à jour (utile dans le cas de tour du monstre)
                        fieldPvJoueur = {name : 'Pv du joueur : ', value : pvDuJoueur.toString()};

                        //Met le champs des PV du Monstre à jour (utile dans le cas où le joueur à lancer un sort)
                        fieldPvMonstre = {name: 'Pv du Monstre : ', value: pvDuMonstre.toString()};

                        //Met le champs des dés du tour à jour (utile dans le cas où le joueur à lancer un sort mais aussi après le tour du monstre)
                        fieldDeDuTour = {name: 'Dés du tour : ', value: 'Dés : ' + deDuTourDescription};

                        const embedUpdate = new EmbedBuilder()
                            .setTitle('Combat Tour ' + t)
                            .setDescription('Vous affrontez un ')//TODO Ajoutez le getName() du Monstre mais pour l'instant la création de Monstre bug
                            .addFields(
                                fieldPvJoueur,
                                fieldPvMonstre,
                                fieldDeDuTour,
                                fieldSort1,
                                fieldSort2,
                                fieldSort3,
                                fieldSort4
                            );
                        await i.update({
                            embeds: [embedUpdate],
                            components: [spellRow]
                        })
                        //endregion
                    }
                    //endregion
                    else{
                        //region ------ FIN DU COMBAT ------
                        /*TODO Bien sur le plus logique pour la réutilisation du code c'est de juste changer le avec une variable puis
                        TODO d'update après mais un peu flemme là*/

                        let messageFinCombat;

                        //region ------ VICTOIRE ------
                        if ( pvDuMonstre <= 0){//TODO remplacer par le monstre.gtPV()
                            //TODO logique de victoire
                            messageFinCombat = 'Vous avez gagné le combat !'
                        }
                        //endregion

                        //region ------ DÉFAITE ------
                        else if (pvDuJoueur <= 0){
                            //TODO logique de défaite
                            messageFinCombat = 'Vous avez perdu le combat ! (gros naze)'
                        }
                        //endregion

                        await i.update({
                            content : messageFinCombat,
                            embeds: [],
                            components: []
                        })

                        //endregion
                    }

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
    }

}

