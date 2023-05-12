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
        this.nom = this.creationNom();
        this.description = this.creationDescription();
        this.attack = this.creationAttack();
        this.defense = this.creationDefense();
        this.hp = this.creationHp();

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
    public creationNom(): string {
        return bouclier[this.id].name;
    }

    public creationDescription(): string{
        return bouclier[this.id].description;
    }
    public creationAttack(): number {
        let valeurMin : number = bouclier[this.id].stats.attack.min;
        let valeurMax : number = bouclier[this.id].stats.attack.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }
    public creationDefense(): number {
        let valeurMin : number = bouclier[this.id].stats.defense.min;
        let valeurMax : number = bouclier[this.id].stats.defense.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }
    public creationHp(): number {
        let valeurMin : number = bouclier[this.id].stats.hp.min;
        let valeurMax : number = bouclier[this.id].stats.hp.max;
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
