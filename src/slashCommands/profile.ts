import {SlashCommand} from "../types";
import {CommandInteraction, EmbedBuilder} from "discord.js";
import {Compte} from "../models/Compte";
import {Personnage} from "../models/Personnage";
import {Race} from "../models/Race";
import {Divinite} from "../models/Divinite";

export const command : SlashCommand = {
    category: "game",
    description: "Permet d'afficher la fiche du personnage",
    name: "profile",
    usage: "",
    execute: async(interaction: CommandInteraction) => {
        let compte : Compte;
        try{
            compte = await Compte.getAccount(interaction.user.id)
        }catch (e){
            return await interaction.reply({content: `Vous n'avez pas de compte /creation_compte`, ephemeral: true});
        }
        let personnage = await compte.getSelectedPersonnage();
        if(personnage === null) return await interaction.reply({content: `Vous n'avez pas sélectionné de personnage /select_personnage`, ephemeral: true});

        const embed : EmbedBuilder = new EmbedBuilder()
            .setTitle(`Voici la fiche de votre personnage`)
            .addFields({name: 'Informations',
                value: `\`Nom :\` ${personnage.getName()}\n`+
                `\`Race :\` ${Race.getEmote(personnage.getRace())} (**${personnage.getRace()}**)\n`+
                `\`Divinité :\` ${Divinite.getEmote(personnage.getDivinity())} (**${personnage.getDivinity()}**)\n`+
                `\`XP :\` ${personnage.calculerNiveau()}, ${personnage.calculerPourcentageProchainNiveau()}%\n`})

        await interaction.reply({embeds: [embed]});
    }
}