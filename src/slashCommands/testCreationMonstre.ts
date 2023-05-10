import {Monstre} from "../models/Monstre";
import {SlashCommand} from "../types";
import {
    ActionRowBuilder,
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonStyle,
    MessageComponentInteraction
} from 'discord.js';


export const command : SlashCommand = {
    category: "test",
    description: "verification que la creation de monstre fonctionne",
    name: "test_creation_monstre",
    usage: "creation_monstre",
    options: [
        {
            type: 'STRING',
            name: 'race',
            description: 'Choisissez une race',
            required: true,
            autocomplete: true
        },
        {
            type: 'STRING',
            name: 'type',
            description: 'choisi te type de monstre',
            required: true,
            autocomplete: true
        },
    ],
    autocomplete: async (interaction: AutocompleteInteraction) => {
        const focusedOption : AutocompleteFocusedOption = interaction.options.getFocused(true);
        let choices : Array<{name: string, value: string}>;
        if(focusedOption.name === 'race') choices = [
            {name: 'Gobelin', value: 'Gobelin'},
            {name: 'Troll', value: 'Troll'}];
        else if(focusedOption.name === 'type') choices = [
            {name: 'Normal', value: 'normal'},
            {name: 'Elite', value: 'elite'},
            {name: 'Boss', value: 'boss'}
        ];
        const filtered :Array<{name: string, value: string}> = choices.filter(
            choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value })),
        );
    },

    execute: async (interaction) => {
       let race : string = interaction.options.get('race').value.toString();
       console.log(race);
        let type : string = interaction.options.get('type').value.toString();
        console.log(type);
       const b: Monstre = new Monstre(race,type);
       console.log(b.getRace());
        console.log(b.getDescription());
        console.log(b.getNom());
        console.log(b.getPv());
        console.log(b.getSort());
        console.log(b.getInventaire());
        console.log(b.degatDeLattaque());

    }
}