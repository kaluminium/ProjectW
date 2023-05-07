import {SlashCommand} from "../types";
import {CommandInteraction} from "discord.js";
import {Compte} from "../models/Compte";
import {Personnage} from "../models/Personnage";
import {ListePersonnage} from "../models/ListePersonnage";
import {De} from "../models/De";

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
        const listePersonnages : ListePersonnage = await compte.getListPersonnage();

        //Vérifie que l'utilisateur a des personnages, sinon lui propose d'en créer un puis de le sélectionner
        if(listePersonnages.isEmpty()) return await interaction.reply({content: `Vous n'avez pas de personnage, faites /creation_personnage pour créer un personnage,
        \npuis /select_personnage pour sélectionner un personnage`, ephemeral: true});

        //Récupère le personnage sélectionné du compte
        const selectedPersonnage : Personnage = await compte.getSelectedPersonnage();

        //Vérifie que l'utilisateur a un personnage sélectionné, sinon lui propose d'en sélectionner un
        if(selectedPersonnage == null) return await interaction.reply({content: `Vous n'avez pas de personnage sélectionné, faites /select_personnage pour sélectionner un personnage`, ephemeral: true});

        //Temporairement placé ici, à terme la logique du combat sera déplacée dans une classe statique et seulement appelée ici
        //const listeDe : De[] = await selectedPersonnage.
    }

}

