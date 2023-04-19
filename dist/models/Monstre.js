"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monstre = void 0;
const monstre = require("../../mob.json");
class Monstre {
    constructor(race, type) {
        this.sort = []; // tableau de sorts
        this.inventaire = []; // inventaire que le monstre drop à sa mort
        this.type = type;
        this.race = race;
        this.nom = this.creationDuNom(race);
        this.description = monstre[race].description;
        this.pv = this.calculeDeLaVie(race, type);
        this.ajoutDesSort(race);
        this.ajouterInventaire(race, type);
    }
    ajouterInventaire(race, type) {
        let tailleTableauLoot = monstre[race].loot.length;
        let i = 0;
        let nbDeDrop;
        while (i < tailleTableauLoot) {
            if (this.deCent() <= monstre[race].loot[i].chance) {
                let dropMin = monstre[race].loot[i].drop_min;
                let dropMax = monstre[race].loot[i].drop_max;
                if (type === "normal") {
                    nbDeDrop = Math.floor(Math.random() * (dropMax - dropMin + 1)) + dropMin;
                }
                else {
                    nbDeDrop = Math.floor(Math.random() * (dropMax - dropMin + 1)) + dropMin + 2;
                }
                let idDuDrop = monstre[race].loot[i].id;
                this.inventaire.push(idDuDrop);
                this.inventaire.push(nbDeDrop);
            }
            i++;
        }
        if (type === "boss") {
            i = 0;
            let tailleTableauLootBoss = monstre[race].loot_boss.length;
            while (i < tailleTableauLootBoss) {
                if (this.deCent() <= monstre[race].loot_boss[i].chance) {
                    let dropMin = monstre[race].loot_boss[i].drop_min;
                    let dropMax = monstre[race].loot_bosss[i].drop_max;
                    let nbDeDrop = Math.floor(Math.random() * (dropMax - dropMin + 1)) + dropMin;
                    let idDuDrop = monstre[race].loot_boss[i].id;
                    this.inventaire.push(idDuDrop, nbDeDrop);
                }
                i++;
            }
        }
    }
    // return un chiffre en 0 et 100 avec 2 chiffres avec la virgule
    deCent() {
        return parseFloat((Math.random() * 100).toFixed(2));
    }
    calculeDeLaVie(race, type) {
        let vieMin = monstre[race].vie_min;
        let vieMax = monstre[race].vie_max;
        if (type === "boss") {
            return Math.floor((Math.random() * (vieMax - vieMin + 1) + vieMin) * 1.50);
        }
        else if (type === "elite") {
            return Math.floor((Math.random() * (vieMax - vieMin + 1) + vieMin) * 1.20);
        }
        else {
            return Math.floor(Math.random() * (vieMax - vieMin + 1)) + vieMin;
        }
    }
    ajoutDesSort(race) {
        let nombreDeSort = monstre[race].attaque.length;
        let nbDeSortAPush = 1;
        let i = 0;
        while (i < nbDeSortAPush || i == nombreDeSort) {
            let valeurAleatoire = Math.floor(Math.random() * (nombreDeSort - 1 + 1));
            if (!this.sort.includes(monstre[race].attaque[valeurAleatoire])) {
                this.sort.push(monstre[race].attaque[valeurAleatoire]);
                i++;
            }
        }
    }
    creationDuNom(race) {
        let nombreDePrefixe = monstre[race].prefixe.length;
        let nombreDeSufixe = monstre[race].sufixe.length;
        let randomPrefixe = Math.floor(Math.random() * (nombreDePrefixe - 1 + 1));
        let randomSufixe = Math.floor(Math.random() * (nombreDeSufixe - 1 + 1));
        let nom = monstre[race].prefixe[randomPrefixe] + " " + race + " "
            + monstre[race].sufixe[randomSufixe];
        return nom;
    }
    getTailleInventaire() {
        return this.inventaire.length;
    }
    getInventaire() {
        return this.inventaire;
    }
    getSort() {
        return this.sort;
    }
    getPv() {
        return this.pv;
    }
    getDescription() {
        return this.description;
    }
    getNom() {
        return this.nom;
    }
    getRace() {
        return this.race;
    }
}
exports.Monstre = Monstre;
