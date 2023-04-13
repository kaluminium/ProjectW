import {Compte} from "./Compte";

class Personnage{
    private name : string;
    private xp : number;
    private id : number;
    private divinity : Divinite;
    private account : Compte;
    private success : Succes[];
    private inventory : Inventaire;
    private race : Race;
    private sex : string;

    constructor(name: string, divinity : string, race : string, sex : string) {

    }

    public getName() : string{
        return this.name;
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
}
export{Personnage};