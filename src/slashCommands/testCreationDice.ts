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
        const personnage = new Personnage(1, "test", "Ocean", "Elfe", "test", 0);
       console.log(personnage);
       console.log("Dice Divinite");
       console.log(personnage.creationDiceDivinite());
        console.log("Dice Race");
       console.log(personnage.creationDiceRace());
        console.log("Dice en 1 tableau");
        console.log(personnage.creationDice());

    }
}