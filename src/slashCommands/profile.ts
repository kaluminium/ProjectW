import {SlashCommand} from "../types";
import {CommandInteraction, EmbedBuilder} from "discord.js";
import {Compte} from "../models/Compte";
import {Personnage} from "../models/Personnage";
import {Race} from "../models/Race";
import {Divinite} from "../models/Divinite";
import {BackPack} from "../models/BackPack";

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
                `\`PV :\` **${personnage.getPv()}**/${personnage.getPvMax()}\n`+
                `\`XP :\` **Niv.${personnage.calculerNiveau()}** | *${personnage.calculerPourcentageProchainNiveau()}%*\n`})

        let bp = await BackPack.getBackPack(personnage);
        const ressources = bp.getRessources();
        const equipments = bp.getEquipments();

        let ressourcesString = "";
        for(let i = 0; i < ressources.length; i++){
            ressourcesString += `\`[${ressources[i].getReference()}]\` **${ressources[i].getQuantity()}x** ${ressources[i].getName()}\n`
        }

        let equipmentsString = "";
        for(let i = 0; i < equipments.length; i++){
            equipmentsString += `\`[${equipments[i].getId()}]\` ${equipments[i].getName()}\n`
        }

        if(ressourcesString != "") embed.addFields({name: "Ressources", value: ressourcesString});
        if(equipmentsString != "") embed.addFields({name: "Equipements", value: equipmentsString});

        await interaction.reply({embeds: [embed]});
    }
}