

const recipe = require('../../../recipe.json');
const ressource = require('../../../ressource.json');
const forge = require('../../../forgeronRecipe.json');

export class Forgeron{

public static jsonToArray(): Array<string> {
    let array: Array<string> = [];
    for (let i = 0; i < forge.listeRecipe.length; i++) {
        array.push(forge.listeRecipe[i].id);
    }
    return array;
}

public static listeDinformation(rechercher : string): Array<any> {
    let arrayDeRecipe: Array<string> = this.jsonToArray();
    let arrayDeRetour: Array<string> = [];
    for (let i: number = 0; i < arrayDeRecipe.length; i++) {
        let nomRecipe : string = arrayDeRecipe[i];
        arrayDeRetour.push(recipe[nomRecipe][rechercher]);

    }
    return arrayDeRetour;
}

    public static ressourceRequiseNom(id : string): Array<string> {
        let ressource : Array<string> = [];
            for (let i :number = 0; i < recipe[id].ingredients.length; i++) {
                let nomRessource : string = recipe[id].ingredients[i].nom;
                ressource.push(nomRessource);
            }
        return ressource;
    }
    public static ressourceRequiseQuantite(id : string): Array<string> {
        let quantite : Array<string> = [];
        for (let i:number = 0; i < recipe[id].ingredients.length; i++) {
            let quantiteRessource : number = recipe[id].ingredients[i].quantity;
            quantite.push(quantiteRessource.toString());
        }
        return quantite;
    }

    public static ressourceRequiseId(id : string): Array<string> {
        let format : Array<string> = [];
        let ressource : Array<string> = this.ressourceRequiseNom(id);
        let quantite : Array<string> = this.ressourceRequiseQuantite(id);
        for (let i : number = 0; i < ressource.length; i++) {
            let idRessource : string = ressource[i] + " : " + quantite[i];
            format.push(idRessource);
        }
    return format;
    }
}

