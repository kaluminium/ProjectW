import {Personnage} from "../models/Personnage";
import {SlashCommand} from "../types";
import {ButtonStyle, CommandInteraction,} from 'discord.js';


export const command : SlashCommand = {
    category: "test",
    description: "verification que la creation de dice fonctionne",
    name: "test_creation_dice",
    usage: "creation_dice",



    execute: async (interaction: CommandInteraction) => {
        console.log("test");
        let p : Personnage = await Personnage.getPersonnage(1);
       console.log(p);
       console.log("Dice Divinite");
       console.log(p.creationDiceDivinite());
        console.log("Dice Race");
       console.log(p.creationDiceRace());
        console.log("Dice en 1 tableau");
        console.log(p.creationDice());


    }
}