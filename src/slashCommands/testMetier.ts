import { Personnage } from "../models/Personnage";
import { SlashCommand } from "../types";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder, MessageComponentInteraction,
    TextInputBuilder
} from 'discord.js';
import { Forgeron } from "../models/MetierCraft/Forgeron";
import {Zone} from "../models/Zone";

export const command: SlashCommand = {
    category: "test",
    description: "verification que les commandes fonctionnent",
    name: "test_metier",
    usage: "craft",

    execute: async (interaction: CommandInteraction) => {

        let id: Array<string> = Forgeron.listeDinformation("id");
        let nom: Array<string> = Forgeron.listeDinformation("nom");
        let metier: Array<string> = Forgeron.listeDinformation("metier");
        let required_level: Array<string> = Forgeron.listeDinformation("required_level");
        let xp: Array<string> = Forgeron.listeDinformation("Xp");
        let index: number = 0;
        let p : Personnage = await Personnage.getPersonnage(10);
        if (!Zone.verificationZone(p, "village")){
            return interaction.reply({content: "Vous devez etre au village pour fabriquer des objets", ephemeral: true});
        }

        console.log((`affichage du retour de listeDinformation : ${nom}`));
        console.log(`affiche le nom de la ressource  troll ${Forgeron.ressourceRequiseNom("club_troll_recipe")}`);
        console.log(`affiche la quantite de la ressource troll ${Forgeron.ressourceRequiseQuantite("club_troll_recipe")}`);

        console.log(`affiche le nom de la ressource  fer ${Forgeron.ressourceRequiseNom("iron_shield_recipe")}`);
        console.log(`affiche la quantite de la ressource fer ${Forgeron.ressourceRequiseQuantite("iron_shield_recipe")}`);
        console.log((`affichage id: ${id}`));
        console.log((`affichage require lvl: ${required_level}`));
        console.log((`affichage id 0 : ${id[0]}`));
        console.log((`affichage id 1 : ${id[1]}`));
    }

}