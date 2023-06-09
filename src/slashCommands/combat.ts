import {SlashCommand} from "../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
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
import {Ressource} from "../models/Ressource";
export const command: SlashCommand = {
    name: "combat",
    usage: "",
    category: "gameplay",
    description: "Permet de lancer un combat",

    execute: async (interaction) => {

        //TODO factoriser la vérification de commande plutôt que remettre le bloc de code dans chaque commande
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

        //Récupération des id des sorts du perso
        const sortsPerso = selectedPersonnage.getSort();
        //Variables intermédiaire pour stocker le numéro du sort lancé et ses dommages
        let numSortLance;
        let dmgDuSort;

        //region ------ DÉS ------
        //Création des dés
        const listeDe : Array<De> = selectedPersonnage.creationDice();
        //Séléction et lancer des dés pour le 1er tour
        let deDuTour = combatLogic.choixDeDuTour(listeDe);
        let deLancesDuTour = combatLogic.lancerDeDuTour(deDuTour);
        //Conversion de l'array de dés en string pour pouvoir l'afficher
        let deDuTourDescription = deLancesDuTour.map(([num, str]) => `${num}${str}`).join("; ")
        //endregion

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

        //Tableau des champs de sorts car impossible de concaténer des noms de variables, ça me permet donc de créer les
        //champs de sort dans une boucle
        const fieldSort = [];

        const spellRow  = new ActionRowBuilder<any>()
        //Boucle à travers les sors du joueur pour créer les champs et boutons nécessaires
        for (let j = 0; j < sortsPerso.length; j++){
            let sortActuel = sortsPerso[j];
            let nomSort = Sort.getName(sortActuel);

            //Crée le bouton du sort
            let button = new ButtonBuilder()
                .setCustomId(`spell_`+j)
                .setLabel(nomSort)

            //Assigne la couleur du bouton en fonction de son type
            switch (Sort.getType(sortActuel)){

                case "R" :
                    button.setStyle(ButtonStyle.Danger);
                    break;

                case "G" :
                    button.setStyle(ButtonStyle.Success);
                    break;

                case "B" :
                    button.setStyle(ButtonStyle.Primary);
                    break;
            }

            //Ajoute le bouton à spellRow
            spellRow.addComponents(button);

            //Crée le champ du sort
            fieldSort[j] = {name : "__"+nomSort+" : __", value : Sort.getDescription(sortActuel) + " : " + Sort.getDegats(sortActuel)}
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

        //region ------ AFFICHAGE EMBED ------
        let reponse = await interaction.reply({
            embeds: [embed],
            components: [spellRow]
        });
        //endregion

        //region ------ COLLECTOR ------
        //Vérifie quel sort a été lancé puis déclenche les actions nécessaires (appel de la fonction de dmg du sort)
        // + appel de la fonction de prise du dmg du monstre
        const collector = reponse.createMessageComponentCollector({time: 360000});
        collector.on('collect', async (i) => {
            if (i.member.user.id !== interaction.member.user.id) return;

            //region ------ GESTION DES BOUTONS ------

            //Vérifie quel sort a été choisi
            switch (i.customId) {
                case "spell_0" :
                    numSortLance = 0;
                    break;

                case "spell_1" :
                    numSortLance = 1;
                    break;

                case "spell_2" :
                    numSortLance = 2;
                    break;

                case "spell_3" :
                    numSortLance = 3;
                    break;

                case "passe_tour" :
                    tourPasse = true;
                    break;
            }

            //Essaye de lancer le sort choisi, si ce n'est pas possible maj les messages d'actions pour l'indiquer
            //Sinon maj les pv du monstres, les messages d'actions et les dés du tour
            try{
                //Maj des pv du monstre
                dmgDuSort = Sort.launch(sortsPerso[numSortLance], deLancesDuTour.slice(0,3));
                pvDuMonstre = monstre.prendreDegats(dmgDuSort);

                //Maj des messages d'actions
                messageAvantDerniereAction = messageDerniereAction;
                messageDerniereAction = 'Vous lancez '+ Sort.getName(sortsPerso[numSortLance])+' : '+nomDuMonstre+' -'+dmgDuSort+'PV';

                //Maj des dés du tour
                deLancesDuTour.splice(0, 3);
                deDuTourDescription = deLancesDuTour.map(([num, str]) => `${num}${str}`).join("; ");
            }
            catch (echecLancerSort){
                messageAvantDerniereAction = messageDerniereAction;
                messageDerniereAction = 'Vous ne pouvez pas lancer ce sort';
            }
            //endregion

            //region ------ MISE A JOUR EMBED ------

            //region ------ TOUR DU MONSTRE ------
            if (deLancesDuTour.length === 0 || tourPasse) {

                //remet tourPasse à false au cas où le joueur ait passé son tour et update le numéro du tour
                tourPasse = false;
                t++;

                //Maj les pv du joueurs avec l'attaque du Monstre
                dmgDuMonstre = monstre.degatDeLattaque();
                pvDuJoueur = selectedPersonnage.prendreDegats(dmgDuMonstre);

                //Maj les messages d'actions
                messageAvantDerniereAction = messageDerniereAction;
                messageDerniereAction = 'Le '+nomDuMonstre+' vous attaque avec '+monstre.getSort()+' : -'+dmgDuMonstre +'PV';

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

                //Construit/Reconstruit l'embedUpdate pour maj les infos
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
                    for(let i = 0; i < monstre.getInventaire().length; i+=2){
                        let item : string = monstre.getInventaire()[i].toString();
                        let quantity : number = parseInt(monstre.getInventaire()[i+1].toString());
                        console.log(item + ' ' + quantity)
                        let res = new Ressource(selectedPersonnage, item, quantity);
                        await Ressource.addRessourceBDD(res);
                    }

                    let orPersonnage = await Ressource.getRessourceBDD(selectedPersonnage, 'or');

                    embedFinCombat
                        .setColor('#00FF00')
                        .setTitle('**------------ VICTOIRE ------------**')
                        .addFields(
                            {name: '__Drop(s) : __', value: monstre.getInventaire().toString()},
                            {name: '__Votre Or : __', value: orPersonnage.getQuantity().toString(), inline: true},
                            {name: '__Or gagné : __', value: '+' + Monstre.getOr(monstre.getInventaire()), inline: true},
                            {name: '\n', value: '\n'},
                            {
                                name: '__Votre XP : __',
                                value: selectedPersonnage.getXp().toString(),
                                inline: true
                            },
                            {name: '__XP gagnée : __', value: monstre.getXp().toString(), inline: true}
                        )
                    selectedPersonnage.addXp(monstre.getXp());
                }
                //endregion

                //region ------ DÉFAITE ------
                else if (pvDuJoueur <= 0) {//Pourrait être remplace par juste else, mais ça aide la lecture
                    //TODO logique de défaite
                    let orPerdu = new Ressource(selectedPersonnage, 'or', Monstre.getOr(monstre.getInventaire()));
                    await Ressource.removeRessourceBDD(orPerdu);
                    let orPersonnage = await Ressource.getRessourceBDD(selectedPersonnage, 'or');


                    embedFinCombat
                        .setColor('#FF0000')
                        .setTitle('**------------ DÉFAITE ------------**')
                        .addFields(
                            {name: '__Votre Or : __', value: orPersonnage.getQuantity().toString(), inline: true},
                            {name: '__Or perdu : __', value: '-' + Monstre.getOr(monstre.getInventaire()), inline: true}
                        )
                }

                selectedPersonnage.setPv(pvDuJoueur);
                await Personnage.savePersonnage(selectedPersonnage);


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