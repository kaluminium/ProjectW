import {Personnage} from "./Personnage";
import {BDDConnexion} from "./BDDConnexion";

class ListePersonnage{
    private listePersonnage : Array<Personnage>;
    private maxPersonnage : number = 3;

    constructor(...liste : Array<Personnage>) {
        this.listePersonnage = liste;
    }

    public isFull() : boolean{
        return this.listePersonnage.length >= this.maxPersonnage;
    }

    public isEmpty() : boolean{
        return this.listePersonnage.length == 0;
    }

    public addPersonnage(personnage : Personnage) : void{
        if (this.isFull()) throw new Error("Vous avez atteint le nombre maximum de personnage");
        this.listePersonnage.push(personnage);
    }

    public removePersonnage(personnage : Personnage) : void{
        this.listePersonnage.splice(this.listePersonnage.indexOf(personnage), 1);
    }

    public static async getListePersonnage(id : number) : Promise<ListePersonnage>{
        const bdd = await BDDConnexion.getInstance();
        const result = await bdd.query("SELECT * FROM `personnage` WHERE `account_id` = ?", [id]);
        let listePersonnage = new ListePersonnage();
        if(result.length > 0){
            for(let i = 0; i < result.length; i++){
                let personnage : Personnage = await Personnage.getPersonnage(result[i].id);
                listePersonnage.addPersonnage(personnage);
            }
        }
        return listePersonnage;
    }

    public getLength() : number{
        return this.listePersonnage.length;
    }

    public getPersonnage(index : number) : Personnage{
        return this.listePersonnage[index];
    }
}

export{ListePersonnage};