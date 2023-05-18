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
import {Sort} from "../models/sort";


export const command: SlashCommand = {
    name: "combat",
    usage: "",
    category: "gameplay",
    description: "Permet de lancer un combat",

    execute: async (interaction) => {

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

        //region ------ MISE EN PLACE MONSTRE ET JOUEUR ------

        //region ------ JOUEUR ------
        //Une partie de la logique de combat est placée dans le script "combatLogic.ts", toutefois c'est une classe static donc c'est tout de même
        //la fonction de combat qui gérera les variables (Arrays de dés)
        let pvDuJoueur = selectedPersonnage.getPv();

        //Création sorts
        const sortsPerso = selectedPersonnage.getSort();
        let dmgDuSort;

        //Création des dés
        const listeDe : Array<De> = selectedPersonnage.creationDice();
        //Séléction et lancer des dés pour le 1er tour
        let deDuTour = combatLogic.choixDeDuTour(listeDe);
        let deLancesDuTour = combatLogic.lancerDeDuTour(deDuTour);
        //Conversion de l'array de dés en string pour pouvoir l'afficher
        let deDuTourDescription = deLancesDuTour.map(([num, str]) => `${num}${str}`).join("; ")
        //endregion

        //region ------ MONSTRE ------
        //Création du monstre
        //Valeur hardcodées dans le constructeur pour rendre la démo plus simple
        const monstre : Monstre = new Monstre("Gobelin", "normal");

        const nomDuMonstre = monstre.getNom();
        let pvDuMonstre = monstre.getPv();
        let dmgDuMonstre;
        //endregion

        //endregion

        //region ------ MISE EN PLACE EMBED ------
        let t = 1;
        let tourPasse = false;

        //region ------ CREATION CHAMPS ------
        //variables qui permettent de gérer les tours

        //TODO pour l'instant il est hardcodé à même le script mais à terme ça serait bien d'aller le pioche dans un JSON par exemple
        let messagesDebut =
            ['\nVous vous êtes bien échauffé ?',
            '\nIl aurait fallu lire les sorts avant !',
            '\nPersonnellement je prendrais mes jambes à mon cou',
            '\nPas sûr qu\'il vous drop un Gelano',
            '\nBonne chance, vous en aurez besoin !',
            '\nVous n\'auriez pas du voler ses citrons !',
            '\nSoyez gentil il a eu une semaine difficile',
            '\nDésolé, l\'auteur était en grève',
            '\nMa fois, pourquoi pas ?',
            '\nVous pourriez le laisser gagner, c\'est son anniversaire'
            ];

        let messageDerniereAction = 'Vous avez engagé le combat contre '+nomDuMonstre+messagesDebut[Math.floor(Math.random()* messagesDebut.length)];
        let messageAvantDerniereAction;

        let avantDerniereAction;//Vide au début du combat car une seule action
        let derniereAction = {name :'__Dernière Action :__', value : messageDerniereAction};
        let fieldPvJoueur = {name : '__Pv du joueur :__', value : pvDuJoueur.toString(), inline : true};
        let fieldPvMonstre = {name : '__Pv du Monstre :__', value : pvDuMonstre.toString(), inline : true};
        let fieldDeDuTour = {name : '__Dés du tour :__', value : 'Dés : ' +deDuTourDescription};
        //endregion

        //region ------ CREATION CHAMPS/BOUTONS SORTS ------

        //TODO Permet de stocker les sorts pour plus tard (vraiment utile ?)
        //Tableau des champs de sorts car impossible de concaténer des noms de variables, ça me permet donc de créer les
        //champs de sort dans une boucle
        const sorts = [];
        const fieldSort = [];

        const spellRow  = new ActionRowBuilder<any>()
        //Boucle à travers les sors du joueur pour créer les champs et boutons nécessaires
        for (let j = 0; j < sortsPerso.length; j++){
            sorts[j] = new Sort(sortsPerso[j]);
            let nomSort = sorts[j].getName();

            //Crée le bouton du sort
            spellRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`spell_`+(j+1))
                    .setLabel(nomSort)
                    .setStyle(ButtonStyle.Danger)
            )
            //TODO remplacer getCout par getDegats
            //Crée le champ du sort
            fieldSort[j] = {name : "__"+nomSort+" : __", value : sorts[j].getDescription() + " : " + sorts[j].getCout()}
        }
        //bouton de passage de tour
        spellRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`passe_tour`)
                .setLabel(`Passer Tour`)
                .setStyle(ButtonStyle.Secondary)
        )
        //endregion

        //Construction de l'embed
        const embed : EmbedBuilder = new EmbedBuilder()
            .setColor('#0000FF')
            .setTitle('**------------ Combat Tour : '+t+' ------------**')
            .setDescription('Vous affrontez un '+nomDuMonstre)
            .addFields(
                derniereAction,
                fieldPvJoueur,
                fieldPvMonstre,
                fieldDeDuTour,
                fieldSort[0],
                fieldSort[1],
                fieldSort[2],
                fieldSort[3]
            );
        //endregion

        let reponse = await interaction.reply({
            embeds: [embed],
            components: [spellRow]
        });

                //region ------ COLLECTOR ------
                //Vérifie quel sort a été lancé puis déclenche les actions nécessaires (appel de la fonction de dmg du sort)
                // + appel de la fonction de prise du dmg du monstre
                const collector = reponse.createMessageComponentCollector({time: 360000});
                collector.on('collect', async (i) => {
                    if (i.member.user.id !== interaction.member.user.id) return;

                    //region ------ GESTION DES BOUTONS ------
                    switch (i.customId) {
                        case "spell_1" :
                            //TODO c'est là que y aura le try/catch comme ça les dmg sont mis et les dé supprimés seulement si le sort se lance
                            //Maj des pv du monstre
                            dmgDuSort = 2;//TODO appel à la fonction de dmg du sort
                            pvDuMonstre = monstre.prendreDegats(dmgDuSort);

                            messageAvantDerniereAction = messageDerniereAction;
                            messageDerniereAction = 'Vous lancez '+'nomDuSort'+' : '+nomDuMonstre+' -'+dmgDuSort+'PV';

                            //Maj des dés du tour
                            deLancesDuTour.splice(0, 3);
                            deDuTourDescription = deLancesDuTour.map(([num, str]) => `${num}${str}`).join("; ");

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

                    //region ------ TOUR DU MONSTRE ------
                    if (deLancesDuTour.length === 0 || tourPasse) {

                        //remet tourPasse à false au cas où le joueur ait passé son tour
                        tourPasse = false;
                        t++;

                        dmgDuMonstre = monstre.degatDeLattaque();
                        pvDuJoueur = selectedPersonnage.prendreDegats(dmgDuMonstre);

                        messageAvantDerniereAction = messageDerniereAction;
                        messageDerniereAction = 'Le '+nomDuMonstre+' vous attaque avec '+'getNomAttaque()'+' : -'+dmgDuMonstre +'PV';
                        //region ------ LANCEMENT NOUVEAUX DÉS ------
                        deDuTour = combatLogic.choixDeDuTour(listeDe);
                        deLancesDuTour = combatLogic.lancerDeDuTour(deDuTour);
                        deDuTourDescription = deLancesDuTour.map(([num, str]) => `${num}${str}`).join("; ")
                        //endregion
                    }
                    //endregion

                    //region ------ MISE A JOUR DES CHAMPS ------
                    if (pvDuMonstre > 0 && pvDuJoueur > 0) {

                        //Met le champ des PV du joueur à jour (utile dans le cas de tour du monstre)
                        fieldPvJoueur = {name : '__Pv du joueur :__', value : pvDuJoueur.toString(), inline : true};
                        //Met le champs des PV du Monstre à jour (utile dans le cas où le joueur à lancer un sort)
                        fieldPvMonstre = {name: '__Pv du Monstre :__', value: pvDuMonstre.toString(), inline : true};
                        //Met le champs des dés du tour à jour (utile dans le cas où le joueur à lancer un sort mais aussi après le tour du monstre)
                        fieldDeDuTour = {name: '__Dés du tour :__', value: 'Dés : ' + deDuTourDescription};
                        //Met le champs de la dernière action à jour (toujours utile)
                        derniereAction = {name :'__Dernière Action :__', value : messageDerniereAction};
                        //Met le champs de l'avant dernière action à jour (toujours utile)
                        avantDerniereAction = {name :'__Avant Dernière Action :__', value : messageAvantDerniereAction};

                        const embedUpdate = new EmbedBuilder()
                            .setColor('#0000FF')
                            .setTitle('**------------ Combat Tour : ' + t + ' ------------**')
                            .setDescription('Vous affrontez un ' + nomDuMonstre)
                            .addFields(
                                avantDerniereAction,
                                derniereAction,
                                fieldPvJoueur,
                                fieldPvMonstre,
                                fieldDeDuTour,
                                fieldSort[0],
                                fieldSort[1],
                                fieldSort[2],
                                fieldSort[3]
                            );

                        await i.update({
                            embeds: [embedUpdate],
                            components: [spellRow]
                        })
                    }
                    //endregion

                    //region ------ FIN DU COMBAT ------
                    else {
                        const embedFinCombat = new EmbedBuilder();
                        //region ------ VICTOIRE ------
                        if (pvDuMonstre <= 0) {
                            //TODO logique de victoire
                            embedFinCombat
                                .setColor('#00FF00')
                                .setTitle('**------------ VICTOIRE ------------**')
                                .addFields(
                                    {name: '__Drop(s) : __', value: monstre.getInventaire().toString()},
                                    {name: '__Votre Or : __', value: 'selectedPersonnage.getOr()', inline: true},
                                    {name: '__Or gagné : __', value: '+' + 'monstre.getOr()', inline: true},
                                    {name: '\n', value: '\n'},
                                    {
                                        name: '__Votre XP : __',
                                        value: selectedPersonnage.getXp().toString(),
                                        inline: true
                                    },
                                    {name: '__XP gagnée : __', value: 'monstre.getXp()', inline: true}
                                )
                        }
                        //endregion

                        //region ------ DÉFAITE ------
                        else if (pvDuJoueur <= 0) {//Pourrait être remplace par juste else, mais ça aide la lecture
                            //TODO logique de défaite
                            embedFinCombat
                                .setColor('#FF0000')
                                .setTitle('**------------ DÉFAITE ------------**')
                                .addFields(
                                    {name: '__Votre Or : __', value: 'selectedPersonnage.getOr()', inline: true},
                                    {name: '__Or perdu : __', value: '-' + 'monstre.getOrDefaite()', inline: true}
                                )
                        }
                        //endregion

                        await i.update({
                            embeds: [embedFinCombat],
                            components: []
                        })
                    }
                    //endregion

                //endregion
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

