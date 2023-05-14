import { De } from "./De";

const sort = require("../../sort.json");

export class Sort {

    private id: string;
    private name: string;
    private description: string;
    private cout: Array<string>;
    private association: string;

    constructor(id: string) {
        this.id = id;
        this.name = sort[id].name;
        this.description = sort[id].description;
        this.cout = this.ajoutDuCout(id);
        this.association = sort[id].association;
    }

  //  public  lunch_rayon_de_givre(dice: Array<De>): number{

   // }


    public static isCoutValide(couleurRequise: Array<string>, couleurEnvoye: Array<string>): boolean {
        if (couleurRequise.length != 3 || couleurEnvoye.length != 3) {
            throw new Error("L'array doit etre egale a 3");
        }
            if (couleurRequise.sort().toString() === couleurEnvoye.sort().toString()) {
                return true;
            }
        return false;
        }



    public ajoutDuCout(id: string): Array<string> {

        let cout: Array<string> = [];
        for (let i = 0; i < sort[id].cout.length; i++) {
            cout.push(sort[id].cout[i].couleur);
        }
        return cout;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getCout(): Array<string> {
        return this.cout;
    }

    public getAssociation(): string {
        return this.association;
    }
}