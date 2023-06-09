import {Compte} from "./Compte";
import {ListePersonnage} from "./ListePersonnage";
import {BDDConnexion} from "./BDDConnexion";
import {De} from "./De";
import {Inventaire} from "./Inventaire";
import {BackPack} from "./BackPack";
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
    //TODO A moyen terme il serait bien de séparer la logique de pvMax en pvDeBase et pvBonus
    private pv : number
    private pvMax : number;
    private zone : string; // zone actuelle du personnage
    private timerActuel : number; // temps au lancement de la commande
    private timerDisponible : number; // temps quand le personnage sera disponible
    private backPack : BackPack;

    constructor(id : number, name: string, divinity : string, race : string, sex : string, xp : number,
                zone : string, timerActuel : number, timerDisponible : number, pv : number) {
        this.id = id;
        this.name = name;
        this.divinity = divinity;
        this.race = race;
        this.sex = sex;
        this.xp = xp;
        this.zone = zone
        this.timerActuel = timerActuel;
        this.timerDisponible = timerDisponible;
        this.pv = pv;
        this.pvMax = this.calculDesPvMax(race, divinity);
    }

    //region ------ CREATION VIE MAX ------
    public calculVieRace(race:string): number{
        switch (race){
            case 'human':
                return  100;
            case 'elf':
                return 800;
            case 'dwarf':
                return  120;
            default:
        }
    }
    public calculVieDivinity(divinity:string): number{
        switch (divinity){
            case 'mountain':
                return 120;
            case 'ocean':
               return  80;
            case 'volcano':
                return 100;
            default:
        }
    }
    public calculDesPvMax(race : string, divinity : string): number{
        return this.calculVieRace(race) + this.calculVieDivinity(divinity);
    }
    //endregion

    //region ------ CREATION DÉS ------
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
    //endregion

    //region ------ GETTERS ------

    public getZone() : string {
        return this.zone;
    }
    public getTimerActuel() : number{
        return this.timerActuel;
        }
    public getTimerDisponible() : number{
        return this.timerDisponible;
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

    public getPv() :number{
        return this.pv;
    }

    public getPvMax() : number{
        return this.pvMax;
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
            let zone = result[0].zone;
            let timerActuel = result[0].timerActuel;
            let timerDisponible = result[0].timerDisponible;
            let pv = result[0].pv;
            let personnage = new Personnage(id, name, divinity, race, sex, xp, zone, timerActuel,timerDisponible,pv);
            personnage.backPack = await BackPack.getBackPack(personnage);
            return personnage;
        }
        throw new Error("Le personnage n'existe pas");
    }

    public getSort(): Array<string> {
        let listeSort: Array<string> = [];
        for (let i : number = 0; i < sortRace[this.getRace()].listDeSort.length; i++) {
            listeSort.push(sortRace[this.getRace()].listDeSort[i].id);
        }
        for (let i : number = 0; i < sortDivinity[this.getDivinity()].listDeSort.length; i++) {
            listeSort.push(sortDivinity[this.getDivinity()].listDeSort[i].id);
        }

        return listeSort;
    }

    //endregion

    //region ------ SETTERS ------
    public setName(name : string) : void{
        this.name = name;
    }

    public setPv(pv: number){
        this.pv = pv;
    }

    private setPvMax(pvMax : number){
        this.pvMax = pvMax;
    }
    //endregion

    //region ------ VALIDATION CREATION PERSO ------

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
        let personnageId = await bdd.query("SELECT `id` FROM `personnage` WHERE `account_id` = ? AND `name` = ?", [id, name]);
        await bdd.query("INSERT INTO `forgeron` (`id`) VALUES (?)", [personnageId[0].id]);
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

    //endregion

    //region ------ COMBAT, XP ET NIVEAUX ------
    public prendreDegats(dmg: number): number{

        //Possibilité de rajouter une condition
        this.setPv(this.getPv()-dmg);

        //return aussi les pv pour rendre le code plus compact, cela évite d'écrire une ligne de code supplémentaire lorsqu'on appelle la fonction
        return this.getPv();
    }

    public soignerDegats(soins: number): number {

        //Vérifie que les soins ne vont pas dépasser la vie max, sinon set les pv égaux à pvMax
        if (this.getPv() + soins <= this.getPvMax()){
            this.setPv(this.getPv()+soins);
        }
        else {
            this.setPv(this.getPvMax());
        }

        //return aussi les pv pour rendre le code plus compact, cela évite d'écrire une ligne de code supplémentaire lorsqu'on appelle la fonction
        return this.getPv()
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
    //endregion

    //region ------ EQUIPEMENTS ------

    public ajusterPvMax(valPv : number, equipe :boolean){

        //Si le joueur équipe l'objet, ajouter son bonus de Pv aux pvMax du joueur
        if (equipe){
            this.setPvMax(this.getPvMax()+valPv);
            //TODO à enlever lors de l'implémentation de l'architecture pvDeBase/pvBonus
            //Si le joueur était full vie quand il a équipé son objet, augmente aussi ses pv actuels en conséquences
            if (this.getPv()-valPv===this.getPvMax()) this.setPv(this.getPvMax());
        }
        else {
            this.setPvMax(this.getPvMax()-valPv);
            //TODO à enlever lors de l'implémation de l'architecture pvDeBase/pvBonus
            //Si après avoir désequipper son objet le joueur a plus de pv que de pvMax, baisse ses pv en conséquences
            if (this.getPv()>this.getPvMax()) this.setPv(this.getPvMax());
        }
    }

    public addXp(xp : number) {
        this.xp += xp;
    }

    public static async savePersonnage(personnage : Personnage){
        const bdd = await BDDConnexion.getInstance();
        await bdd.query("UPDATE `personnage` SET `xp` = ?, `pv` = ? WHERE `id` = ?", [personnage.getXp(), personnage.getPv(), personnage.getId()]);
    }

    //endregion

}
export{Personnage};