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
        console.log(Sort.getName(s.getId()));
        console.log(Sort.getDescription(s.getId()));
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
        /*
        test de throw error, en commentaire pour test les autres , le test fonctionne
        let couleurRequise4 : Array<string> = ["B","B","G"];
        let couleurEnvoye4 : Array<string> = ["B","B","B","B"];
        console.log(Sort.isCoutValide(couleurRequise4,couleurEnvoye4));
        */



        console.log("lunchSort");
        let cout : Array<[number,string]> =  [[3, "B"], [3, "B"], [2, "B"]];
        console.log(Sort.launch_rayon_de_givre(cout));
        /*
        test de throw error, en commentaire pour test les autres , le test fonctionne
        let cout2 : Array<[number,string]> =  [[3, "B"], [3, "B"], [2, "G"]];
        console.log(Sort.lunch_rayon_de_givre(cout2));
        */

}
}