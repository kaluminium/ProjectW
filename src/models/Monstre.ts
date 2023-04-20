const monstre = require("../../mob.json");

export class Monstre {

    private type: string; // type du monstre ( boss, elite ,normal)
    private race: string; // race de monstre (gobelin, orc, mort vivant)
    private nom: string; // composé d'un prefixe, d'un nom et d'un suffixe
    private description: string;
    private pv: number; // points de vie aleatoire compris entre un min et un max
    private sort: Array<string> = []; // tableau de sorts

    private  inventaire: [string, number][] = []; // inventaire que le monstre drop à sa mort

    constructor(race: string, type: string) {
        this.type = type;
        this.race = race;
       this.nom = this.creationDuNom(race);
        this.description = monstre[race].description;
        this.pv = this.calculeDeLaVie(race, type);
        this.ajoutDesSort(race);
        this.ajouterInventaire(race, type);
    }

    public ajouterInventaire(race : string, type : string){
        let tailleTableauLoot: number = monstre[race].loot.length;
        let i : number = 0;
        let nbDeDrop;
        while ( i < tailleTableauLoot ){
                if ( this.deCent() <= monstre[race].loot[i].chance){
                    let dropMin = monstre[race].loot[i].drop_min;
                    let dropMax = monstre[race].loot[i].drop_max;
                    if (type === "normal") {
                        nbDeDrop = Math.floor(Math.random() * (dropMax - dropMin + 1)) + dropMin;
                    }else{
                        nbDeDrop = Math.floor(Math.random() * (dropMax - dropMin + 1)) + dropMin + 2;
                    }
                    let idDuDrop = monstre[race].loot[i].id;
                    this.inventaire.push(idDuDrop);
                    this.inventaire.push(nbDeDrop);

                }
            i ++;
        }

        if (type === "boss"){
            i = 0;
            let tailleTableauLootBoss : number = monstre[race].loot_boss.length;
            while (i < tailleTableauLootBoss){
                if (this.deCent() <= monstre[race].loot_boss[i].chance){
                    let dropMin = monstre[race].loot_boss[i].drop_min;
                    let dropMax = monstre[race].loot_bosss[i].drop_max;
                    let nbDeDrop = Math.floor(Math.random() * (dropMax - dropMin + 1)) + dropMin;
                    let idDuDrop = monstre[race].loot_boss[i].id;
                    this.inventaire.push(idDuDrop,nbDeDrop);

                }
                i++;
            }
        }
    }
    // return un chiffre en 0 et 100 avec 2 chiffres avec la virgule
    public deCent():number{
        return parseFloat((Math.random() * 100).toFixed(2));

    }
   public calculeDeLaVie(race: string, type: string): number {
        let vieMin: number = monstre[race].vie_min;
        let vieMax: number = monstre[race].vie_max;
        if (type === "boss") {
            return Math.floor((Math.random() * (vieMax - vieMin + 1) + vieMin) * 1.50);

        } else if (type === "elite") {
            return Math.floor((Math.random() * (vieMax - vieMin + 1) + vieMin) * 1.20);

        } else {
            return Math.floor(Math.random() * (vieMax - vieMin + 1)) + vieMin;
        }
    }

    public ajoutDesSort(race: string): void {
        let nombreDeSort: number = monstre[race].attaque.length;
        let nbDeSortAPush: number = 1;
        let i: number = 0;
        while (i < nbDeSortAPush || i == nombreDeSort) {
            let valeurAleatoire = Math.floor(Math.random() * (nombreDeSort - 1 + 1));
            if (!this.sort.includes(monstre[race].attaque[valeurAleatoire])) {
                this.sort.push(monstre[race].attaque[valeurAleatoire].id);
                i++;
            }
        }
    }

    public creationDuNom(race: string): string {
        let nombreDePrefixe: number = monstre[race].prefixe.length;
        let nombreDeSufixe: number = monstre[race].sufixe.length;
        let randomPrefixe: number = Math.floor(Math.random() * (nombreDePrefixe - 1 + 1)) ;
        let randomSufixe: number = Math.floor(Math.random() * (nombreDeSufixe - 1 + 1)) ;
        let nom = monstre[race].prefixe[randomPrefixe] + " " + race + " "
            + monstre[race].sufixe[randomSufixe];
        return nom;


    }
    public degatDeLattaque():number{
        let nombreDeSortDisponible = this.sort.length;
        let randomSort : number = Math.floor(Math.random() * (nombreDeSortDisponible - 1 + 1));
        let idDuSort = this.sort[randomSort];
        for (let i = 0; i< monstre[this.race].attaque.length; i++){
            if (monstre[this.race].attaque[i].id === idDuSort){
                return monstre[this.race].attaque[i].degat;
            }
        }
        return 0; // si trouve pas retourne 0
    }

    public setPv(pv: number): void {
        this.pv = pv;
    }

    public getTailleInventaire(): number{
        return this.inventaire.length;
    }
    public getInventaire(): [string, number][] {
        return this.inventaire;
    }

    public getSort(): Array<string> {
        return this.sort;
    }

    public getPv(): number {
        return this.pv;
    }

    public getDescription(): string {
        return this.description;
    }

    public getNom(): string {
        return this.nom;
    }


    public getRace(): string {
        return this.race;
    }
}
