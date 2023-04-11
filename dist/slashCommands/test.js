"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Personnage_1 = require("../models/Personnage");
const discord_js_1 = require("discord.js");
exports.command = {
    category: "test",
    description: "test",
    name: "test",
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
    autocomplete: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const focusedOption = interaction.options.getFocused(true);
        let choices;
        if (focusedOption.name === 'race')
            choices = [
                { name: 'Humain', value: 'human' },
                { name: 'Elfe', value: 'elf' },
                { name: 'Nain', value: 'dwarf' }
            ];
        else if (focusedOption.name === 'sexe')
            choices = [
                { name: 'Homme', value: 'man' },
                { name: 'Femme', value: 'woman' }
            ];
        else if (focusedOption.name === 'divinite')
            choices = [
                { name: 'Montagne', value: 'mountain' },
                { name: 'Ocean', value: 'ocean' },
                { name: 'Foret', value: 'forest' }
            ];
        const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        yield interaction.respond(filtered.map(choice => ({ name: choice.name, value: choice.value })));
    }),
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        let name = interaction.options.get('nom').value.toString();
        let race = interaction.options.get('race').value.toString();
        let sexe = interaction.options.get('sexe').value.toString();
        let divinite = interaction.options.get('divinite').value.toString();
        let raceChoices = ['human', 'elf', 'dwarf'];
        let sexeChoices = ['man', 'woman'];
        let diviniteChoices = ['mountain', 'ocean', 'forest'];
        if (!raceChoices.includes(race)) {
            yield interaction.reply({ content: `Race invalide`, ephemeral: true });
            return;
        }
        if (!sexeChoices.includes(sexe)) {
            yield interaction.reply({ content: `Sexe invalide`, ephemeral: true });
            return;
        }
        if (!diviniteChoices.includes(divinite)) {
            yield interaction.reply({ content: `Divinité invalide`, ephemeral: true });
            return;
        }
        if (!Personnage_1.Personnage.verifyName(name)) {
            yield interaction.reply({ content: `Nom invalide` });
            return;
        }
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('validate')
            .setLabel('Valider !')
            .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
            .setCustomId('exit')
            .setLabel('Quitter')
            .setStyle(discord_js_1.ButtonStyle.Danger));
        name = Personnage_1.Personnage.putCapitalLetter(name);
        const reponse = yield interaction.reply({
            content: `Nom: ${name}, Race: ${race}, Sexe: ${sexe}, Divinité: ${divinite}`,
            components: [row],
            ephemeral: true
        });
        const personnage = new Personnage_1.Personnage(name, divinite, race, sexe);
        const collector = reponse.createMessageComponentCollector({ time: 5000 });
        collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
            if (i.member.user.id !== interaction.member.user.id)
                return;
            if (i.customId === 'validate') {
                yield i.update({ content: 'Personnage créé !', components: [] });
                //await personnage.create();
                collector.stop();
            }
            else if (i.customId === 'exit') {
                yield i.update({ content: 'Personnage non créé', components: [] });
                collector.stop();
            }
        }));
        collector.on('end', (i, reason) => __awaiter(void 0, void 0, void 0, function* () {
            if (reason === 'time') {
                yield reponse.edit({ content: 'Personnage non créé, Trop de temps', components: [] });
                setTimeout(() => {
                    reponse.delete();
                }, 10000);
            }
        }));
    })
};
