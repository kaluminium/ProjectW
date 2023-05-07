import {SlashCommand} from "../types";
import {CommandInteraction} from "discord.js";
import {Compte} from "../models/Compte";
import {Personnage} from "../models/Personnage";
import {ListePersonnage} from "../models/ListePersonnage";

export const command: SlashCommand = {
    name: "combat",
    usage: "",
    category: "gameplay",
    description: "Permet de lancer un combat",

    execute: async (interaction) => {
        let compte: Compte;
        let personnage : Personnage;
        const listePersonnages : ListePersonnage = await compte.getListPersonnage();

        //Récupère le compte du joueur
        //Erreur(s) possible :
        //- L'utilisateur n'a pas de compte : gérée, indique à l'utilisateur qu'il n'a pas de compte et lui propose d'en créer un
        try {
            compte = await Compte.getAccount(interaction.user.id)
        } catch (e) {
            return await interaction.reply({content: `Vous n'avez pas de compte, faites /creation_compte pour créer un compte`, ephemeral: true});
        }

        //Vérifie que l'utilisateur a des personnages, sinon lui propose d'en créer un puis de le sélectionner
        //if(listePersonnages.isEmpty()) return await interaction.reply({content: `Vous n'avez pas de personnage, faites /creation_personnage pour créer un personnage,\npuis /select_personnage pour sélectionner un personnage`, ephemeral: true});


    }

}

