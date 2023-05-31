const bouclier = require('../../../bouclier.json');
export class Bouclier {
    private id: string;
    private nom: string;
    private description: string;
    private attack: number;
    private defense: number;
    private hp: number;


    constructor(id: string) {
        this.id = id;
        this.nom = this.creationNom(id);
        this.description = this.creationDescription(id);
        this.attack = this.creationAttack(id);
        this.defense = this.creationDefense(id);
        this.hp = this.creationHp(id);

    }

    public getQualite(): string {
        // qualité ( commun, rare, légendaire)
        let qualiteMax : number = bouclier[this.id].stats.hp.max + bouclier[this.id].stats.defense.max + bouclier[this.id].stats.attack.max
        let qualiteObjet : number = this.getAttack() + this.getDefense() + this.getHp();
        if ((qualiteObjet/ qualiteMax)*100 < 50){
            return "commun"

        }else if ((qualiteObjet/ qualiteMax)*100 < 75){
            return "rare"

        }else {
            return "légendaire"
        }
    }
    public creationNom(id : string): string {
        return bouclier[id].name;
    }

    public creationDescription(id : string): string{
        return bouclier[id].description;
    }
    public creationAttack(id : string): number {
        let valeurMin : number = bouclier[id].stats.attack.min;
        let valeurMax : number = bouclier[id].stats.attack.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }
    public creationDefense(id : string): number {
        let valeurMin : number = bouclier[id].stats.defense.min;
        let valeurMax : number = bouclier[id].stats.defense.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }
    public creationHp(id : string): number {
        let valeurMin : number = bouclier[id].stats.hp.min;
        let valeurMax : number = bouclier[id].stats.hp.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }

    public getIda(): string {
        return this.id;
    }
    public getNom(): string {
        return this.nom;
    }
    public getDescription(): string {
        return this.description;
    }
    public getHp(): number {
        return this.hp;
    }

    public getDefense(): number {
        return this.defense;
    }

    public getAttack(): number {
        return this.attack;
    }

}
