import {Personnage} from "../models/Personnage";
import {SlashCommand} from "../types";
import {
    ActionRowBuilder,
    AutocompleteFocusedOption,
    AutocompleteInteraction,
    ButtonBuilder,
    ButtonStyle,
    MessageComponentInteraction
} from 'discord.js';
import {Compte} from "../models/Compte";


export const command : SlashCommand = {
    category: "test",
    description: "permet de créer un personnage",
    name: "creation_personnage",
    usage: "test",
    options: [
        {
            type: 'STRING',
            name: 'nom',
            description: 'Choisissez un nom (entre 3 à 16 caractères, pas de caractères spéciaux ni de chiffres)',
            required: true,
            autocomplete: false
        },
        {
            type: 'STRING',
            name: 'race',
            description: 'choisi ta race',
            required: true,
            autocomplete: true
        },
        {
            type: 'STRING',
            name: 'divinite',
            description: 'choisi ta divinité',
            required: true,
            autocomplete: true
        },
        {
            type: 'STRING',
            name: 'sexe',
            description: 'choisi ton sexe',
            required: true,
            autocomplete: true
        }
    ],
    autocomplete: async (interaction: AutocompleteInteraction) => {
        const focusedOption : AutocompleteFocusedOption = interaction.options.getFocused(true);
        let choices : Array<{name: string, value: string}>;
        if(focusedOption.name === 'race') choices = [
            {name: 'Humain', value: 'human'},
            {name: 'Elfe', value: 'elf'},
            {name: 'Nain', value: 'dwarf'}];
        else if(focusedOption.name === 'sexe') choices = [
            {name: 'Homme', value: 'man'},
            {name: 'Femme', value: 'woman'}];
        else if(focusedOption.name === 'divinite') choices = [
            {name: 'Montagne', value: 'mountain'},
            {name: 'Ocean', value: 'ocean'},
            {name: 'Volcan', value: 'volcano'}
        ];
        const filtered :Array<{name: string, value: string}> = choices.filter(
            choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value })),
        );
    },

    execute: async (interaction) => {
        let compte : Compte;

        try{
            compte = await Compte.getAccount(interaction.user.id)
        }catch (e){
            return await interaction.reply({content: `Vous n'avez pas de compte /creation_compte`, ephemeral: true});
        }

        if(compte.getListPersonnage().isFull()) return await interaction.reply({content: `Vous avez déjà 3 personnages veuillez en supprimer un`, ephemeral: true});

        let name : string = interaction.options.get('nom').value.toString();
        let race : string = interaction.options.get('race').value.toString();
        let sexe : string = interaction.options.get('sexe').value.toString();
        let divinity : string = interaction.options.get('divinite').value.toString();

        let raceChoices : Array<string> = ['human', 'elf', 'dwarf'];
        let sexeChoices : Array<string> = ['man', 'woman'];
        let diviniteChoices : Array<string> = ['mountain', 'ocean', 'volcano'];

        if(!raceChoices.includes(race)) {
            await interaction.reply({content: `Race invalide`, ephemeral: true});
            return;
        }

        if(!sexeChoices.includes(sexe)) {
            await interaction.reply({content: `Sexe invalide`, ephemeral: true});
            return;
        }

        if(!diviniteChoices.includes(divinity)) {
            await interaction.reply({content: `Divinité invalide`, ephemeral: true});
            return;
        }

        if(!Personnage.verifyName(name)) {
            await interaction.reply({content: `Nom invalide`});
            return;
        }
        const row  = new ActionRowBuilder<any>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('validate')
                        .setLabel('Valider !')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setLabel('Quitter')
                        .setStyle(ButtonStyle.Danger),
                );

        name = Personnage.putCapitalLetter(name);

        const reponse = await interaction.reply({
            content: `Nom: ${name}, Race: ${race}, Sexe: ${sexe}, Divinité: ${divinity}`,
            components: [row],
            ephemeral: true
        });

        const collector = reponse.createMessageComponentCollector({time: 60000});


        collector.on('collect', async (i: MessageComponentInteraction) => {
            if(i.member.user.id !== interaction.member.user.id) return;

            if(i.customId === 'validate'){
                await i.update({content: 'Personnage créé !', components: []});
                await Personnage.register(compte.getId(), name, sexe, divinity, race);
                collector.stop();
            }
            else if(i.customId === 'exit'){
                await i.update({content: 'Personnage non créé', components: []});
                collector.stop();
            }
        })

        collector.on('end', async (i: MessageComponentInteraction, reason) => {
            if(reason === 'time'){
                await reponse.edit({content: 'Personnage non créé, Trop de temps', components: []});
                setTimeout(() => {
                    reponse.delete();
                }, 10000);
            }
        })
    }
}