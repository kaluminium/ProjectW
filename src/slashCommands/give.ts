import {Personnage} from "../models/Personnage";
import {SlashCommand} from "../types";
import {AutocompleteFocusedOption, AutocompleteInteraction, ButtonStyle, CommandInteraction,} from 'discord.js';
import {Zone} from "../models/Zone";
const zoneTableau = require("../../tableauDeZone.json");
import {Compte} from "../models/Compte";
import {ListePersonnage} from "../models/ListePersonnage";
import {Ressource} from "../models/Ressource";

export const command : SlashCommand = {
    category: "PourPres",
    description: "donner les objets pour le craft",
    name: "give",
    usage: "donner les objets pour le craft",



    execute: async (interaction: CommandInteraction) => {
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
        const listePersonnages: ListePersonnage = await compte.getListPersonnage();
        if (listePersonnages.isEmpty()) return await interaction.reply({
            content: `Vous n'avez pas de personnage, faites /creation_personnage pour créer un personnage,
            \npuis /select_personnage pour sélectionner un personnage`,
            ephemeral: true
        });

        //Récupère le personnage sélectionné du compte
        //Puis vérifie que l'utilisateur a un personnage sélectionné, sinon lui propose d'en sélectionner un
        const selectedPersonnage: Personnage = await compte.getSelectedPersonnage();
        if (selectedPersonnage == null) return await interaction.reply({
            content: `Vous n'avez pas de personnage sélectionné, faites /select_personnage pour sélectionner un personnage`,
            ephemeral: true
        });
        //endregion

        let minerai: Ressource = new Ressource(selectedPersonnage, "minerai_de_fer", 100);
        let lingo: Ressource = new Ressource(selectedPersonnage, "lingot_de_fer", 100);
        await Ressource.addRessourceBDD(minerai);
        await Ressource.addRessourceBDD(lingo);
    }
}