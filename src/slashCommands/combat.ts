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
            //TODO DEBUG
            console.log("Les dés de " + selectedPersonnage.getName() +" sont :" + selectedPersonnage.creationDice());
            //return await interaction.reply({content: "Les dés de " + selectedPersonnage.getName() +" sont :" + listeDe, ephemeral: true});

        //Création du monstre
        //Valeur hardcodées dans le constructeur pour rendre la démo plus simple
        //TODO Bug à la création du monstre peux être du à l'absence des JSON ?
        //const monstre : Monstre = new Monstre("gobelin", "normal");
        //endregion

        //region ------ CREATION BOUTONS SORTS ------
        const spellRow  = new ActionRowBuilder<any>()
        //TODO surement à mettre dans une boucle pour itérer sur les 5 sorts à créer
        spellRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`spell`)
                .setLabel(`Boule de feu du chaos de fou complétement dingo`)
                .setStyle(ButtonStyle.Danger)
        )
        //endregion


        //region ------ BOUCLE DE COMBAT ------
        //TODO : i sera l'indice d'itération de la boucle de combat, il permettra notamment d'afficher les tours de combat
        let i = 0;
        //while (true){

            //region ------ TOUR DU JOUEUR ------
            let deDuTour = combatLogic.choixDeDuTour(listeDe);
            let deLancésDuTour = combatLogic.lancerDeDuTour(deDuTour);//Y a un bug ici aussi je crois mais vu que ça lache avant bah ça crash pas ici

            //TODO : AJOUTEZ LES INFOS DU CBT (DESCR. 5 SORTS, PV JOUEUR, PV MONSTRE) en addfield
            const embed : EmbedBuilder = new EmbedBuilder()
                .setTitle('Combat Tour '+i)
                .setDescription('Vous affrontez un ');//TODO Ajoutez le getName() du Monstre mais pour l'instant la création de Monstre bug

            let reponse = await interaction.reply({
                embeds: [embed],
                components: [spellRow]
            });
            const collector = reponse.createMessageComponentCollector({time: 600000});

            //TODO : CHECK LES 5 SORTS + plutôt le remplacer le if par un switch
            //Vérifie quel sort a été lancé puis déclenche les actions nécessaires (appel de la fonction de dmg du sort
            // + appel de la fonction de prise du dmg du monstre
            collector.on('collect', async (i) => {
                if(i.member.user.id !== interaction.member.user.id) return;
                if(i.customId == "spell"){
                    await i.update({
                        content: `Vous avez lancer le sort 1`,
                        components: [],
                        embeds: []
                    });
                    collector.stop();
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
            i++;

        //}
        //endregion



    }

}

