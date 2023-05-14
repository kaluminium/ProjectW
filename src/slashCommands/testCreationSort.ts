import {Personnage} from "../models/Personnage";
import {SlashCommand} from "../types";
import {ButtonStyle, CommandInteraction,} from 'discord.js';
import { Sort } from "../models/sort";
const sort = require("../../sort.json");
const sortRace = require("../../associationSortRace.json");
const sortDivinity = require("../../associationSortDivinity.json");

export const command : SlashCommand = {
    category: "test",
    description: "verification que la creation de sort fonctionne",
    name: "test_creation_sort",
    usage: "creation_sort",



    execute: async (interaction: CommandInteraction) => {
        console.log("Creation de sort");
        let s : Sort = new Sort("boule_de_feu");
        console.log(s);
        console.log(s.getId());
        console.log(s.getName());
        console.log(s.getDescription());
        console.log(s.getAssociation());
        console.log(s.getCout());

        console.log("getSort");
        console.log(sortRace["human"].listDeSort.length);
        let p : Personnage = await Personnage.getPersonnage(1);
        console.log(p.getSort());

        console.log("isCoutValide");
        let couleurRequise : Array<string> = ["B","B","B"];
        let couleurEnvoye : Array<string> = ["B","B","B"];
        console.log(Sort.isCoutValide(couleurRequise,couleurEnvoye));
        let couleurRequise2 : Array<string> = ["B","B","G"];
        let couleurEnvoye2 : Array<string> = ["B","G","B"];
        console.log(Sort.isCoutValide(couleurRequise2,couleurEnvoye2));
        let couleurRequise3 : Array<string> = ["B","B","G"];
        let couleurEnvoye3 : Array<string> = ["B","B","B"];
        console.log(Sort.isCoutValide(couleurRequise3,couleurEnvoye3));
        let couleurRequise4 : Array<string> = ["B","B","G"];
        let couleurEnvoye4 : Array<string> = ["B","B","B","B"];
        console.log(Sort.isCoutValide(couleurRequise4,couleurEnvoye4));


    }
}