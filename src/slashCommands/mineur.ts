import {Mineur} from "../models/MetierRecolte/Mineur";
import {SlashCommand} from "../types";
import {AutocompleteFocusedOption, AutocompleteInteraction, ButtonStyle,} from 'discord.js';
import {Compte} from "../models/Compte";
import {ListePersonnage} from "../models/ListePersonnage";
import {Personnage} from "../models/Personnage";
import {Zone} from "../models/Zone";



export const command : SlashCommand = {
    category: "metier",
    description: "commande pour le metier de mineur",
    name: "mineur",
    usage: "recolter des ressources",
    options: [
        {
            type: 'NUMBER',
            name: 'temps',
            description: 'Choisissez une durée de récolte',
            required: true,
            autocomplete: true
        },
    ],
    autocomplete: async (interaction: AutocompleteInteraction) => {
        const focusedOption : AutocompleteFocusedOption = interaction.options.getFocused(true);
        let choices : Array<{name: string, value: number}>;
        if(focusedOption.name === 'temps') choices = [
            {name: '10 minutes', value: 10},
            {name: '20 minutes', value: 20},
            {name: '30 minutes', value: 30}];
        const filtered :Array<{name: string, value: number}> = choices.filter(
            choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value })),
        );
    },

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

        //region ------ VERIFICATIONS DE LA ZONE ET DU TIMER ------
        let time: number = Date.now();
        if (!Zone.verificationZone(selectedPersonnage, "montagne")){
            return interaction.reply({content: "Vous devez etre a la montagne pour miner", ephemeral: true});
        }
        if (!Zone.verificationTimer(selectedPersonnage, time)){
            return interaction.reply({content: "Vous ne pouvez pas faire ça pour le moment", ephemeral: true});
        }


        //endregion

        //region ------ AJOUT DES MINERAIS ------
        let temps : string = interaction.options.get('temps').value.toString()
        let tempsInt : number = parseInt(temps)
        Mineur.ajoutBDDMinerai(selectedPersonnage,Mineur.nombreDeMinerai(tempsInt));
        Zone.ajoutDunTimer(selectedPersonnage,time);
        return interaction.reply({content: `Vous avez miner ${Mineur.nombreDeMinerai(tempsInt)} minerai de fer en ${temps} minutes`, ephemeral: true});
        //endregion
    }
}
