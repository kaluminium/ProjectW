import {Arme} from "../models/Equipement/Arme";
import {Armure} from "../models/Equipement/Armure";
import {Bouclier} from "../models/Equipement/Bouclier";
import {SlashCommand} from "../types";
import {AutocompleteFocusedOption, AutocompleteInteraction, ButtonStyle,} from 'discord.js';


export const command : SlashCommand = {
    category: "test",
    description: "verification que la creation des equipement fonctionne",
    name: "test_creation_equipement",
    usage: "creation_equipement",
    options: [
        {
            type: 'STRING',
            name: 'idarme',
            description: 'Choisissez un equipement',
            required: true,
            autocomplete: true
        },
        {
            type: 'STRING',
            name: 'idarmure',
            description: 'Choisissez un equipement',
            required: true,
            autocomplete: true
        },
        {
            type: 'STRING',
            name: 'idbouclier',
            description: 'Choisissez un equipement',
            required: true,
            autocomplete: true
        },
    ],
    autocomplete: async (interaction: AutocompleteInteraction) => {
        const focusedOption : AutocompleteFocusedOption = interaction.options.getFocused(true);
        let choices : Array<{name: string, value: string}>;
        if(focusedOption.name === 'idarme') choices = [
            {name: 'gobelin_sword', value: 'gobelin_sword'},
            {name: 'iron_sword', value: 'iron_sword'},
            {name: 'club_troll', value: 'club_troll'}];
        else if(focusedOption.name === 'idarmure') choices = [
            {name: 'iron_faceplate', value: 'iron_faceplate'},
            {name: 'gobelin_faceplate', value: 'gobelin_faceplate'},
            {name: 'troll_faceplate', value: 'troll_faceplate'}];
        else if(focusedOption.name === 'idbouclier') choices = [
            {name: 'iron_shield', value: 'iron_shield'},
            {name: 'gobelin_shield', value: 'gobelin_shield'},
            {name: 'troll_shield', value: 'troll_shield'}
        ];
        const filtered :Array<{name: string, value: string}> = choices.filter(
            choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value })),
        );
    },

    execute: async (interaction) => {
        const armes = require('../../arme.json');
        let idarme : string = interaction.options.get('idarme').value.toString();
        let idarmure : string = interaction.options.get('idarmure').value.toString();
        let idbouclier : string = interaction.options.get('idbouclier').value.toString();
        console.log(armes[idarme].stats.attack.min)
        const A: Arme = new Arme(idarme);
        const B: Armure = new Armure(idarmure);
        const C: Bouclier = new Bouclier(idbouclier);
        console.log("Arme");
        console.log(A.getNom());
        console.log(A.getDescription());
        console.log(A.getDefense());
        console.log(A.getAttack());
        console.log(A.getHp());
        console.log(A.getQualite());
        console.log("Armure");
        console.log(B.getNom());
        console.log(B.getDescription());
        console.log(B.getDefense());
        console.log(B.getAttack());
        console.log(B.getHp());
        console.log(B.getQualite());
        console.log("Bouclier");
        console.log(C.getNom());
        console.log(C.getDescription());
        console.log(C.getDefense());
        console.log(C.getAttack());
        console.log(C.getHp());
        console.log(C.getQualite());


    }
}
