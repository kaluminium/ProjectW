import {Personnage} from "./Personnage";

class ListePersonnage{
    private listPersonnage : Array<Personnage>;
    private maxPersonnage : number = 3;

    constructor(...liste : Array<Personnage>) {
        this.listPersonnage = liste;
    }

    public isFull() : boolean{
        return this.listPersonnage.length >= this.maxPersonnage;
    }

    public addPersonnage(personnage : Personnage) : void{
        if (this.isFull()) throw new Error("Vous avez atteint le nombre maximum de personnage");
        this.listPersonnage.push(personnage);
    }

    public removePersonnage(personnage : Personnage) : void{
        this.listPersonnage.splice(this.listPersonnage.indexOf(personnage), 1);
    }


}

export{ListePersonnage};