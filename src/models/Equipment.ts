import {Personnage} from "./Personnage";
import {BDDConnexion} from "./BDDConnexion";
const armor = require("../../armure.json");
const weapon = require("../../arme.json");
const shield = require("../../bouclier.json");


export class Equipment{
    private personnage : Personnage;
    private id : number;
    private reference : string;
    private pv : number;
    private attack : number;
    private intelligence : number;
    private agility : number;
    private strength : number;
    private armor : number;

    constructor(personnage : Personnage, reference : string, pv : number, attack : number, intelligence : number, agility : number, strength : number, armor : number){
        this.reference = reference;
        this.pv = pv;
        this.attack = attack;
        this.intelligence = intelligence;
        this.agility = agility;
        this.strength = strength;
        this.armor = armor;
        this.personnage = personnage;
    }

    public static async getEquipment(id : number): Promise<Equipment>{
        const bdd = await BDDConnexion.getInstance();
        const result = await bdd.query("SELECT * FROM `items` WHERE `id` = ?", [id]);
        const equip = new Equipment(await Personnage.getPersonnage(result[0].personnage_id), result[0].reference, result[0].pv, result[0].atk, result[0].intelligence, result[0].agility, result[0].strength, result[0].armor);
        equip.id = result[0].id;
        return equip;
    }

    public static async addEquipmentBDD(equipement : Equipment): Promise<void>{
        const bdd = await BDDConnexion.getInstance();
        await bdd.query("INSERT INTO `items`(`personnage_id`, `reference`, `pv`, `atk`, `intelligence`, `agility`, `strength`, `armor`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [equipement.personnage.getId(), equipement.reference, equipement.pv, equipement.attack, equipement.intelligence, equipement.agility, equipement.strength, equipement.armor]);
    }

    public getReference(): string{
        return this.reference;
    }

    public setId(id : number): void{
        this.id = id;
    }

    public getId(): number{
        return this.id;
    }

    public getName(): string{
        if(weapon[this.reference] != undefined){
            return weapon[this.reference].name;
        }else if(armor[this.reference] != undefined){
            return armor[this.reference].name;
        }else if(shield[this.reference] != undefined){
            return shield[this.reference].name;
        }else return "undefined";
    }

    public getDescription(): string{
        if(weapon[this.reference] != undefined){
            return weapon[this.reference].description;
        }else if(armor[this.reference] != undefined){
            return armor[this.reference].description;
        }else if(shield[this.reference] != undefined){
            return shield[this.reference].description;
        }else return "undefined";
    }
}