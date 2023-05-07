import {SlashCommand} from "../types";
import {CommandInteraction} from "discord.js";
import {Compte} from "../models/Compte";
import {Personnage} from "../models/Personnage";
import {ListePersonnage} from "../models/ListePersonnage";
import {De} from "../models/De";
import {combatLogic} from "../combatLogic";

export const command: SlashCommand = {
    name: "combat",
    usage: "",
    category: "gameplay",
    description: "Permet de lancer un combat",

    execute: async (interaction) => {
        let compte: Compte;
        //Peut être pas besoin, je vais peut être directement me servir du selectedPersonnage
        let personnage : Personnage;

        //Récupère le compte du joueur
        //Erreur(s) possible :
        //- L'utilisateur n'a pas de compte : gérée, indique à l'utilisateur qu'il n'a pas de compte et lui propose d'en créer un
        try {
            compte = await Compte.getAccount(interaction.user.id)
        } catch (e) {
            return await interaction.reply({content: `Vous n'avez pas de compte, faites /creation_compte pour créer un compte`, ephemeral: true});
        }
        //Récupère la liste de personnages du compte
        //Puis vérifie que l'utilisateur a des personnages, sinon lui propose d'en créer un puis de le sélectionner
        const listePersonnages : ListePersonnage = await compte.getListPersonnage();
        if(listePersonnages.isEmpty()) return await interaction.reply({content: `Vous n'avez pas de personnage, faites /creation_personnage pour créer un personnage,
        \npuis /select_personnage pour sélectionner un personnage`, ephemeral: true});

        //TODO : A TESTER, je peux pas test parce que je peux pas select de perso, tout ce qui est au dessus fonctionne, tout ce qui est en dessous n'est pas testé

        //Récupère le personnage sélectionné du compte
        //Puis vérifie que l'utilisateur a un personnage sélectionné, sinon lui propose d'en sélectionner un
        const selectedPersonnage : Personnage = await compte.getSelectedPersonnage();
        if(selectedPersonnage == null) return await interaction.reply({content: `Vous n'avez pas de personnage sélectionné, faites /select_personnage pour sélectionner un personnage`, ephemeral: true});

        //Une partie de la logique de combat est placée dans le script "combatLogic.ts", toutefois c'est une classe static donc c'est tout de même
        //la fonction de combat qui gérera les variables (Arrays de dés)
        const listeDe : Array<De> = selectedPersonnage.creationDice(selectedPersonnage.getId());

        //TODO : Temporaire, debugging pour vérifier que le reste de la commande fonctionne
        return await interaction.reply({content: listeDe.toString(), ephemeral: true})

        //A mettre dans une boucle while une fois la création du monstre gérée dans le combat, pour l'instant vérifie juste que le tirage de dé fonctionne
        let deDuTour = combatLogic.choixDeDuTour(listeDe);
        let valeurDeDuTour = combatLogic.lancerDeDuTour(deDuTour);
    }

}

