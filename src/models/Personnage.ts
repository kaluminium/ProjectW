import {Compte} from "./Compte";
import {ListePersonnage} from "./ListePersonnage";
import {BDDConnexion} from "./BDDConnexion";
import {De} from "./De";
const sortRace = require("../../associationSortRace.json");
const sortDivinity = require("../../associationSortDivinity.json");

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


    public  getSort(): Array<string> {
        let listeSort: Array<string> = [];
        for (let i : number = 0; i < sortRace[this.getRace()].listDeSort.length; i++) {
            listeSort.push(sortRace[this.getRace()].listDeSort[i].id);
        }
        for (let i : number = 0; i < sortDivinity[this.getDivinity()].listDeSort.length; i++) {
            listeSort.push(sortDivinity[this.getDivinity()].listDeSort[i].id);
        }

        return listeSort;
    }

    public creationDice(): Array<De> {
        let diceRace: Array<De> = this.creationDiceRace();
        diceRace.push(...this.creationDiceDivinite());
        return diceRace;
    }

  public  creationDiceRace(): Array<De>{

        let faceDeDes : number[] = [1,2,3,4,5,6];
        let DiceRace : Array<De> = [];
        switch (this.getRace()) {
            case 'human':
                let couleurfacesB: string[] = ['B', 'B', 'B', 'B', 'B', 'B'];
                for (let i = 0; i < 5; i++) {
                    let HumainB = new De(faceDeDes, couleurfacesB, 'B');
                    DiceRace.push(HumainB);
                }
                break;
            case 'dwarf':
                let couleurfacesR: string[] = ['R', 'R', 'R', 'R', 'R', 'R'];
                for (let i = 0; i < 5; i++){
                     let NainR = new De(faceDeDes, couleurfacesR, 'R');
                DiceRace.push(NainR);
                 }
                break;
            case 'elf':
                let couleurfacesG : string[] = ['G', 'G', 'G', 'G', 'G', 'G'];
                for (let i = 0; i < 5; i++) {
                    let ElfeG = new De(faceDeDes, couleurfacesG, 'G');
                    DiceRace.push(ElfeG);
                }
                break;
        }
        return DiceRace;
    }

  public  creationDiceDivinite(): Array<De>{

        let faceDeDes : number[] = [1,2,3,4,5,6];
        let couleurfacesG : string[] = ['G', 'G', 'G', 'G', 'G', 'G'];
        let couleurfacesB : string[] = ['B', 'B', 'B', 'B', 'B', 'B'];
        let couleurfacesR : string[] = ['R', 'R', 'R', 'R', 'R', 'R'];
        let DiceRace : Array<De> = [];
        switch (this.getDivinity()){
            case 'mountain':
                for (let i = 0; i < 3; i++) {
                    let MontagneD = new De(faceDeDes, couleurfacesG, 'G');
                    DiceRace.push(MontagneD);
                }
                for (let i = 0; i < 2; i++) {
                    let MontagneD = new De(faceDeDes, couleurfacesR, 'R');
                    DiceRace.push(MontagneD);
                }
                break;
            case 'ocean':
                for (let i = 0; i < 3; i++) {
                    let OceanD = new De(faceDeDes, couleurfacesB, 'B');
                    DiceRace.push(OceanD);
                }
                for (let i = 0; i < 2; i++) {
                    let OceanD = new De(faceDeDes, couleurfacesG, 'G');
                    DiceRace.push(OceanD);
                }
                break;
            case 'volcano':
            for (let i = 0; i < 3; i++) {
                let VolcanD = new De(faceDeDes, couleurfacesR, 'R');
                DiceRace.push(VolcanD);
            }
            for (let i = 0; i < 2; i++) {
                let VolcanD = new De(faceDeDes, couleurfacesB, 'B');
                DiceRace.push(VolcanD);
            }
                break;
        }
        return DiceRace;
    }
    public getRace() : string{
        return this.race;
    }
    public getDivinity() : string{
        return this.divinity;
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

    public static ajouterVirgule(xp : number) : string{
        let str = xp.toString();
        let newStr = "";
        let compteur = 0;
        for(let i = str.length - 1; i >= 0; i--){
            if(compteur == 3){
                newStr += ",";
                compteur = 0;
            }
            newStr += str[i];
            compteur++;
        }
        return newStr.split("").reverse().join("");
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

    public calculerPourcentageProchainNiveau() : string{
        const niveauMax = 100;
        const xpMax = 1000000000;

        // Calculer le niveau et l'expérience nécessaires pour atteindre le prochain niveau
        let niveau = 1;
        let xpNiveau = 50;
        while (this.xp >= xpNiveau && niveau < niveauMax) {
            this.xp -= xpNiveau;
            niveau++;
            xpNiveau = Math.floor(125 * Math.pow(1.1, niveau - 2));
        }

        // Limiter le niveau à la valeur maximale
        niveau = Math.min(niveau, niveauMax);

        // Calculer le pourcentage d'expérience nécessaire pour atteindre le prochain niveau
        let pourcentage = this.xp / xpNiveau * 100;

        // Limiter le pourcentage à la plage de valeurs de 0 à 100
        pourcentage = Math.max(0, pourcentage);
        pourcentage = Math.min(100, pourcentage);

        // Retourner le pourcentage
        return pourcentage.toFixed(2);
    }

}
export{Personnage};