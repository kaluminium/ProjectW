const armes = require('../../../arme.json');
export class Arme {
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
        let qualiteMax : number = armes[this.id].stats.hp.max + armes[this.id].stats.defense.max + armes[this.id].stats.attack.max
        let qualiteObjet : number = this.getAttack() + this.getDefense() + this.getHp();
        if ((qualiteObjet/ qualiteMax)*100 > 80){
            return "légendaire";

        }else if ((qualiteObjet/ qualiteMax)*100 > 50){
            return "rare";

        }else {
            return "commun";
        }
    }
    public creationNom(): string {
       return armes[this.id].name;
    }

    public creationDescription(): string{
       return armes[this.id].description;
    }
    public creationAttack(): number {
        let valeurMin : number = armes[this.id].stats.attack.min;
        let valeurMax : number = armes[this.id].stats.attack.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }
    public creationDefense(): number {
        let valeurMin : number = armes[this.id].stats.defense.min;
        let valeurMax : number = armes[this.id].stats.defense.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }
    public creationHp(): number {
        let valeurMin : number = armes[this.id].stats.hp.min;
        let valeurMax : number = armes[this.id].stats.hp.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }

    public getId(): string {
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
