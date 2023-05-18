import {Personnage} from "../models/Personnage";
import {SlashCommand} from "../types";
import {AutocompleteFocusedOption, AutocompleteInteraction, ButtonStyle, CommandInteraction,} from 'discord.js';
import {Zone} from "../models/Zone";
const zoneTableau = require("../../tableauDeZone.json");


export const command : SlashCommand = {
    category: "test",
    description: "verification que les zone fonctionne",
    name: "test_creation_zone",
    usage: "creation_zone",
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
        let timestamp : number = Date.now();
        let p : Personnage = await Personnage.getPersonnage(1);
        console.log("timestamp");
        console.log(timestamp);
        console.log("getTimerDisponible");
        console.log(p.getTimerDisponible());
        console.log("Temps restant avant de pouvoir changer de zone");
        console.log(p.getTimerDisponible()-timestamp);

        if (!Zone.verificationTimer(p, timestamp)){
            return interaction.reply({content: "Vous ne pouvez pas changer de zone pour le moment", ephemeral: true});
        }
        /*console.log(timestamp)
        console.log("Test des getteurs de zone");
        console.log(p);
        console.log("test zone");
        console.log(p.getZone());
        console.log("time actuel");
        console.log(p.getTimerActuel());
        console.log("time disponible");
        console.log(p.getTimerDisponible());
        console.log("test des timers");
        console.log(Zone.calculTemps("village","montagne"));
        console.log(`zone actuel : ${p.getZone()}`);
        console.log(`zone voulu : ${interaction.options.get('zone').value.toString()}`);
        console.log(`timeActuel : ${p.getTimerActuel()}`);
        console.log(`timeDisponible : ${p.getTimerDisponible()}`);*/
        let zone : string = interaction.options.get('zone').value.toString();
        Zone.changerDeZoneEtMajTimer(p,timestamp,zone);


    }
}