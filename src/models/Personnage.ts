import {Compte} from "./Compte";
import {ListePersonnage} from "./ListePersonnage";
import {BDDConnexion} from "./BDDConnexion";

class Personnage{
    private name : string;
    private xp : number;
    private id : number;
    private divinity : string;
    private account : Compte;
    private success : Succes[];
    private inventory : Inventaire;
    private race : string
    private sex : string;

    constructor(id : number, name: string, divinity : string, race : string, sex : string, xp : number) {
        this.id = id;
        this.name = name;
        this.divinity = divinity;
        this.race = race;
        this.sex = sex;
        this.xp = xp;
    }

    public getId() : number{
        return this.id;
    }

    public getName() : string{
        return this.name;
    }

    public getXp() : number{
        return this.xp;
    }

    public setName(name : string) : void{
        this.name = name;
    }

    public static verifyName(name : string) : boolean{
        if(name.length < 3 || name.length > 16) return false;
        return !!name.match(/^[a-zA-Z]+$/);
    }

    public static putCapitalLetter(name : string) : string{
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    public static async register(id : number, name : string, sex : string, divinity : string, race : string){
        if(!Personnage.verifyName(name)) throw new Error("Le nom du personnage n'est pas valide");
        name = Personnage.putCapitalLetter(name);
        let listePersonnage = await ListePersonnage.getListePersonnage(id);
        if(listePersonnage.isFull()) throw new Error("Vous avez atteint le nombre maximum de personnage");
        const bdd = await BDDConnexion.getInstance();
        await bdd.query("INSERT INTO `personnage` (`account_id`, `name`, `sex`, `divinity`, `race`) VALUES (?, ?, ?, ?, ?)", [id, name, sex, divinity, race]);
    }

    public static async getPersonnage(id : number) : Promise<Personnage>{
        const bdd = await BDDConnexion.getInstance();
        const result = await bdd.query("SELECT * FROM `personnage` WHERE `id` = ?", [id]);
        if(result.length > 0){
            let id = result[0].id;
            let name = result[0].name;
            let divinity = result[0].divinity;
            let race = result[0].race;
            let sex = result[0].sex;
            let xp = result[0].xp;
            return new Personnage(id, name, divinity, race, sex, xp);
        }
        throw new Error("Le personnage n'existe pas");
    }
}
export{Personnage};