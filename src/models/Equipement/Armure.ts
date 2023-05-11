const armure = require('../../../armure.json');
export class Armure {
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
        let qualiteMax : number = armure[this.id].hp.max + armure[this.id].defense.max + armure[this.id].attack.max
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
        return armure[this.id].nom;
    }

    public creationDescription(): string{
        return armure[this.id].description;
    }
    public creationAttack(): number {
        let valeurMin : number = armure[this.id].attack.min;
        let valeurMax : number = armure[this.id].attack.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }
    public creationDefense(): number {
        let valeurMin : number = armure[this.id].defense.min;
        let valeurMax : number = armure[this.id].defense.max;
        return Math.floor((Math.random() * (valeurMax - valeurMin + 1) + valeurMin));
    }
    public creationHp(): number {
        let valeurMin : number = armure[this.id].hp.min;
        let valeurMax : number = armure[this.id].hp.max;
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
