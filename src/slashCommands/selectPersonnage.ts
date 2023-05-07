import {SlashCommand} from "../types";
import {
    ActionRowBuilder,
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder, MessageComponentInteraction
} from "discord.js";
import {Compte} from "../models/Compte";
import {ListePersonnage} from "../models/ListePersonnage";

export const command : SlashCommand = {
    name: "select_personnage",
    description: "Permet de sélectionner un personnage",
    usage: "select_personnage",
    category: "account",
    execute: async (interaction) => {
        let compte : Compte;
        try{
            compte = await Compte.getAccount(interaction.user.id)
        }catch (e){
            return await interaction.reply({content: `Vous n'avez pas de compte /creation_compte`, ephemeral: true});
        }

        const listePersonnages : ListePersonnage = await compte.getListPersonnage();

        if(listePersonnages.isEmpty()) return await interaction.reply({content: `Vous n'avez pas de personnage /creation_personnage`, ephemeral: true});

        const embed : EmbedBuilder = new EmbedBuilder()
            .setTitle('Sélectionnez un personnage')
            .setDescription('Choisissez un personnage parmi ceux que vous avez créés')
            .setColor('#ff8e4d');

        const row  = new ActionRowBuilder<any>()

        for(let i = 0; i < listePersonnages.getLength(); i++){
            embed.addFields({name: `${listePersonnages.getPersonnage(i).getName()}`, value: `**XP :** \`${listePersonnages.getPersonnage(i).getXp()}\` `});
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`select_${i}`)
                    .setLabel(`${listePersonnages.getPersonnage(i).getName()}`)
                    .setStyle(ButtonStyle.Primary)
            );
        }

        const reponse = await interaction.reply({embeds: [embed], components: [row]});

        const collector = interaction.channel.createMessageComponentCollector({time: 60000});

        collector.on('collect', async (i) => {
            if(i.member.user.id !== interaction.member.user.id) return;
            if(i.customId.startsWith('select_')){
                const personnage = listePersonnages.getPersonnage(parseInt(i.customId.split('_')[1]));
                await compte.changeSelectedPersonnage(personnage);
                await i.update({content: `Vous avez sélectionné **${personnage.getName()}**`, components: [], embeds: []});
                collector.stop();
            }
        })

        collector.on('end', async (i: MessageComponentInteraction, reason) => {
            if(reason === 'time'){
                await reponse.delete();
                collector.stop();
            }
        })
    }
}