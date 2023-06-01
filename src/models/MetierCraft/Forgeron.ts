import {BackPack} from "../BackPack";
import {Personnage} from "../Personnage";
import {Ressource} from "../Ressource";
import {BDDConnexion} from "../BDDConnexion";


const recipe = require('../../../recipe.json');
const ressource = require('../../../ressource.json');
const forge = require('../../../forgeronRecipe.json');

export class Forgeron{
    private id : string;
    private xp : number;
    private lvl : number;


    constructor(id : string, xp : number) {
        this.id = id;
        this.xp = xp;
        this.lvl = this.calculerNiveau();

    }
    getXp(): number {
        return this.xp;
    }
    setXp(xp: number): void {
        this.xp = xp;
    }
    getId(): string {
        return this.id;
    }

    public static async addForgeronBDD(forgeron : Forgeron){
        const bdd = await BDDConnexion.getInstance();
        await bdd.query("UPDATE `forgeron` SET `xp` = ? WHERE `id` = ?", [forgeron.getXp() + forgeron.xp, forgeron.getId()]);
        }


    public static async ajoutExperience(xp : string, personnage : Personnage): Promise<void> {
        let forgeron : Forgeron = await Forgeron.getForgeron(personnage.getId());
        forgeron.setXp(forgeron.getXp() + parseInt(xp));
        Forgeron.addForgeronBDD(forgeron);
    }

    public static async verificationDuLvl(lvl : string, personnage : Personnage): Promise<boolean> {
        let forgeron : Forgeron = await Forgeron.getForgeron(personnage.getId());
        if (forgeron.getLvl() >= parseInt(lvl)){
            return true;
        } else{
            return false;
        }

        }
    public static async retraitDesRessouces(id : string, personnage : Personnage): Promise<void> {
    let ressource : Array<string> = this.idDeLaRessourceRequiseNom(id);
    let quantite : Array<string> = this.ressourceRequiseQuantite(id);
    for (let i : number = 0; i < ressource.length; i++){
        let p :Ressource = new Ressource(personnage, ressource[i], parseInt(quantite[i]));
        await Ressource.removeRessourceBDD(p);
    }

    }


    public static async getForgeron(id : number) : Promise<Forgeron>{
        const bdd = await BDDConnexion.getInstance();
        const result = await bdd.query("SELECT * FROM `forgeron` WHERE `id` = ?", [id]);
        if(result.length > 0){
            let id = result[0].id;
            let xp = result[0].xp;
            let forgeron : Forgeron = new Forgeron(id, xp);
            return forgeron;
    }
    }

    public static async verificationSiRessourcesDisponible(id : string, personnage : Personnage): Promise<boolean> {
        let  ressourceJoueur :Array<Ressource> = await BackPack.getRessourcesBDD(personnage);
        console.log(ressourceJoueur);
        for (let i : number = 0;i < recipe[id].ingredients.length; i++) {
            let nomRessource : string = recipe[id].ingredients[i].id;
            console.log(nomRessource);
            let quantiteRessource : number = recipe[id].ingredients[i].quantity;
            console.log(quantiteRessource);
            let test : boolean = false;
            for (let j :number = 0; j < ressourceJoueur.length; j++){
                if (ressourceJoueur[j].getReference() == nomRessource && ressourceJoueur[j].getQuantity() >= quantiteRessource){
                   test = true;
                }
            }
            if (test == false){
                return false;
            }
            return true;
        }
    }



    public calculerNiveau() : number{
        const niveauMax = 100;

        let niveau = 1;
        let xpNiveau = 50;
        while (this.xp >= xpNiveau && niveau < niveauMax) {
            this.xp -= xpNiveau;
            niveau++;
            xpNiveau = Math.floor(125 * Math.pow(1.1, niveau - 2));
        }

        niveau = Math.min(niveau, niveauMax);
        return niveau;
    }
    public getLvl() : number{
        return this.lvl;
    }
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
    public static idDeLaRessourceRequiseNom(id : string): Array<string> {
        let ressource : Array<string> = [];
        for (let i :number = 0; i < recipe[id].ingredients.length; i++) {
            let nomRessource : string = recipe[id].ingredients[i].id;
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

