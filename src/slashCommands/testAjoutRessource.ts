import {Personnage} from "../models/Personnage";
import {SlashCommand} from "../types";
import {ButtonStyle, CommandInteraction, EmbedBuilder,} from 'discord.js';
import {Ressource} from "../models/Ressource";
import {BackPack} from "../models/BackPack";
import {Equipment} from "../models/Equipment";


export const command : SlashCommand = {
    category: "test",
    description: "verification que la creation de ressource fonctionne",
    name: "test_ajout_ressource",
    usage: "ajout_ressource",



    execute: async (interaction: CommandInteraction) => {
        let p : Personnage = await Personnage.getPersonnage(1);
        let bp = await BackPack.getBackPack(p);
        const ressources = bp.getRessources();
        const equipments = bp.getEquipments();
        const embed = new EmbedBuilder()
            .setTitle("Inventaire de " + p.getName())
            .setColor("#00FFFF")

        let ressourcesString = "";
        for(let i = 0; i < ressources.length; i++){
            ressourcesString += `\`[${ressources[i].getReference()}]\` **${ressources[i].getQuantity()}x** ${ressources[i].getName()}\n`
        }

        let equipmentsString = "";
        for(let i = 0; i < equipments.length; i++){
            equipmentsString += `\`[${equipments[i].getId()}]\` ${equipments[i].getName()}\n`
        }

        embed.addFields({name: "Ressources", value: ressourcesString});
        embed.addFields({name: "Equipements", value: equipmentsString});

        await interaction.reply({embeds: [embed]});
    }
}