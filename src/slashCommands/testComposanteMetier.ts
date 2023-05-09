import {Metier} from "../models/Metier";
import {SlashCommand} from "../types";
import {ButtonStyle, CommandInteraction,} from 'discord.js';
import test from "node:test";

const metier = require("../../metier.json");
const recipe = require("../../recipe.json");

export const command : SlashCommand = {
    category : "test",
    description :"test de la composante métier",
    name :"test_composante_metier",
    usage :"composante_metier",

    execute: async(interaction:CommandInteraction)=> {
        console.log("test");
        for(const met in metier){
            for(const rec in recipe){
                if(recipe[rec].metier === metier[met].id){
                    console.log(`${metier[met].id} : ${recipe[rec].id}`);
                }
            }
        }
        await interaction.reply({content :"regarde le terminal de ton IDE préféré"});
    }
}