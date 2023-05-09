import {ListePersonnage} from "./ListePersonnage";

const recipe = require("../../recipe.json");
const materiau = require("../../materiau.json");

export class Metier {
    private nom: string; // nom du métier instancié
    private xp: number; // expérience accumulée avant d'atteindre le prochain niveau
    private niveau: number; // niveau du métier
    private craftable: string[]; //liste qui contient l'ensemble des recettes réalisable
    private recoltable: string[]; //liste qui contient l'ensemble des matériaux récoltable

    constructor(nom: string) {
        this.nom = nom;
        this.xp = 0;
        this.niveau = 1;
        this.checkCraftable();
    }

    public incrXP(xp: number){
        this.xp +=xp;
        if (this.xp >= 100){
            this.xp -=100;
            this.incrNiveau(1);
        }
    }

    public incrNiveau(niv:number){
        this.niveau += niv;
        this.checkCraftable();
        this.checkRecoltable();
    }

    public checkCraftable() {
        for(const rec of recipe){
            if(this.nom === rec.metier && this.niveau >= rec.required_level && !this.craftable.includes(rec.id)){
                this.craftable += rec.id;
            }
        }
    }

    public checkRecoltable() {
        for(const mat of materiau){
            if(mat.metier === this.nom && mat.base_drop_rate > 0 && !this.recoltable.includes(mat.id)){
                this.recoltable += mat.id;
            }
        }
    }

}