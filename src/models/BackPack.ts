import {Ressource} from "./Ressource";
import {Equipment} from "./Equipment";
import {Personnage} from "./Personnage";
import {BDDConnexion} from "./BDDConnexion";

export class BackPack{
    private size : number;
    private ressources : Array<Ressource>;
    private equipments : Array<Equipment>;
    private personnage : Personnage;

    private constructor(size : number, personnage : Personnage, ressources : Array<Ressource>, equipments : Array<Equipment>){
        this.size = size;
        this.personnage = personnage;
        this.ressources = ressources;
        this.equipments = equipments;
    }

    public static async getEquipmentsBDD(personnage : Personnage) : Promise<Array<Equipment>>{
        const bdd = await BDDConnexion.getInstance();
        const equipments = new Array<Equipment>();
        const result = await bdd.query("SELECT * FROM `items` WHERE `personnage_id` = ?", [personnage.getId()]);
        for(let i = 0; i < result.length; i++){
            const equip = new Equipment(personnage, result[i].reference, result[i].pv, result[i].atk, result[i].intelligence, result[i].agility, result[i].strength, result[i].armor);
            equip.setId(result[i].id);
            equipments.push(equip);
        }
        return equipments;
    }

    public static async getRessourcesBDD(personnage : Personnage) : Promise<Array<Ressource>>{
        const bdd = await BDDConnexion.getInstance();
        const ressources = new Array<Ressource>();
        const result = await bdd.query("SELECT * FROM `ressources` WHERE `personnage_id` = ?", [personnage.getId()]);
        for(let i = 0; i < result.length; i++){
            if(result[i].quantity > 0) ressources.push(new Ressource(personnage, result[i].reference, result[i].quantity));
        }
        return ressources;
    }

    public static async getBackPack(personnage : Personnage) : Promise<BackPack>{
        return new BackPack(0, personnage, await BackPack.getRessourcesBDD(personnage), await BackPack.getEquipmentsBDD(personnage));
    }

    public getRessources(): Array<Ressource>{
        return this.ressources;
    }

    public getEquipments() : Array<Equipment>{
        return this.equipments;
    }

    public toString(){
        for(let i = 0; i < this.ressources.length; i++){
            console.log(this.ressources[i].getReference() + " " + this.ressources[i].getQuantity());
        }
        for(let i = 0; i < this.equipments.length; i++){
            console.log(this.equipments[i].getReference());
        }
    }
}

