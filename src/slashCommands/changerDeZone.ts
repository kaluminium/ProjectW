import {Personnage} from "../models/Personnage";
import {SlashCommand} from "../types";
import {AutocompleteFocusedOption, AutocompleteInteraction, ButtonStyle, CommandInteraction,} from 'discord.js';
import {Zone} from "../models/Zone";
const zoneTableau = require("../../tableauDeZone.json");
import {Compte} from "../models/Compte";
import {ListePersonnage} from "../models/ListePersonnage";

export const command : SlashCommand = {
    category: "gameplay",
    description: "changer de zone",
    name: "changer_de_zone",
    usage: "changer_de_zone",
    options: [
        {
            type: 'STRING',
            name: 'zone',
            description: 'Choisissez une zone',
            required: true,
            autocomplete: true
        },
    ],
    autocomplete: async (interaction: AutocompleteInteraction) => {
        const focusedOption: AutocompleteFocusedOption = interaction.options.getFocused(true);
        let choices: Array<{ name: string, value: string }>;
        if (focusedOption.name === 'zone') choices = [
            {name: 'Village', value: 'village'},
            {name: 'Foret', value: 'foret'},
            {name: 'Montagne', value: 'montagne'}];

        const filtered :Array<{name: string, value: string}> = choices.filter(
            choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value })),
        );
    },

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

        console.log(selectedPersonnage.getTimerDisponible());
        let timestamp : number = Date.now();
        if (!Zone.verificationTimer(selectedPersonnage, timestamp)){
            return interaction.reply({content: "Vous ne pouvez pas changer de zone pour le moment", ephemeral: true});
        }

        let zone : string = interaction.options.get('zone').value.toString();
        Zone.changerDeZoneEtMajTimer(selectedPersonnage,timestamp,zone);
    }
}