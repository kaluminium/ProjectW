import {Personnage} from "./Personnage";
import {BDDConnexion} from "./BDDConnexion";
const ressource = require("../../ressource.json");

export class Ressource{
    private personnage : Personnage;
    private reference : string;
    private quantity : number;

    constructor(personnage : Personnage, reference : string, amount : number){
        this.personnage = personnage;
        this.reference = reference;
        this.quantity = amount;
    }

    public getReference(){
        return this.reference;
    }

    public getQuantity(){
        return this.quantity;
    }

    public setQuantity(quantity : number){
        this.quantity = quantity;
    }

    public static async getRessourceBDD(personnage : Personnage, reference : string) : Promise<Ressource>{
        const bdd = await BDDConnexion.getInstance();
        const result = await bdd.query("SELECT * FROM `ressources` WHERE `personnage_id` = ? AND `reference` = ?", [personnage.getId(), reference]);
        if(result.length == 0){
            return null;
        }
        return new Ressource(personnage, result[0].reference, result[0].quantity);
    }

    private static async createRessourceBDD(personnage : Personnage, reference : string, quantity : number){
        const bdd = await BDDConnexion.getInstance();
        await bdd.query("INSERT INTO `ressources`(`personnage_id`, `reference`, `quantity`) VALUES (?, ?, ?)", [personnage.getId(), reference, quantity]);
    }

    public static async addRessourceBDD(ressource : Ressource){
        const bdd = await BDDConnexion.getInstance();
        const otherRessource = await Ressource.getRessourceBDD(ressource.personnage, ressource.reference)
        if(otherRessource == null){
            await Ressource.createRessourceBDD(ressource.personnage, ressource.reference, ressource.quantity);
        }else{
            await bdd.query("UPDATE `ressources` SET `quantity` = quantity + ? WHERE `personnage_id` = ? AND `reference` = ?", [ressource.quantity, ressource.personnage.getId(), ressource.reference]);
        }
    }

    public static async removeRessourceBDD(ressource : Ressource){
        const bdd = await BDDConnexion.getInstance();
        const otherRessource = await Ressource.getRessourceBDD(ressource.personnage, ressource.reference)
        if(otherRessource !== null) await bdd.query("UPDATE `ressources` SET `quantity` = quantity - ? WHERE `personnage_id` = ? AND `reference` = ?", [ressource.quantity, ressource.personnage.getId(), ressource.reference]);
    }

    public static async setRessourceBDD(ressource : Ressource){
        const bdd = await BDDConnexion.getInstance();
        const otherRessource = await Ressource.getRessourceBDD(ressource.personnage, ressource.reference)
        if(otherRessource == null){
            await Ressource.createRessourceBDD(ressource.personnage, ressource.reference, ressource.quantity);
        }else{
            await bdd.query("UPDATE `ressources` SET `quantity` = ? WHERE `personnage_id` = ? AND `reference` = ?", [ressource.quantity, ressource.personnage.getId(), ressource.reference]);
        }
    }

    public getName(): string{
        if(ressource[this.reference] != undefined){
            return ressource[this.reference].name;
        }else return "undefined";
    }

    public getDescription(): string{
        if(ressource[this.reference] != undefined){
            return ressource[this.reference].description;
        }else return "undefined";
    }
}