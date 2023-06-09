const sort = require("../../sort.json");

export class Sort {

    private id: string;
    private name: string;
    private description: string;
    private cout: Array<string>;
    private association: string;
    private type: string;

    constructor(id: string) {
        this.id = id;
        this.type = sort[id].type;
        this.name = sort[id].name;
        this.description = sort[id].description;
        this.cout = this.ajoutDuCout(id);
        this.association = sort[id].association;
    }

    public static launch(id: string, dice: Array<[number,string]>): number {
        switch (id) {
            case "rayon_de_givre":
                return Sort.launch_rayon_de_givre(dice);
            case "tempete_de_grele":
                return Sort.launch_tempete_de_grele(dice);
            case "trait_ensorcele":
                return Sort.launch_trait_ensorcele(dice);
            case "vague_tonnante":
                return Sort.launch_vague_tonnante(dice);
            case "boule_de_feu":
                return Sort.launch_boule_de_feu(dice);
            case "rayon_ardent":
                return Sort.launch_rayon_ardent(dice);
            case "flamme_eternelle":
                return Sort.launch_flamme_eternelle(dice);
            case "epee_de_feu":
                return Sort.launch_epee_de_feu(dice);
            case "eclair":
                return Sort.launch_eclair(dice);
            case "eclat_du_soleil":
                return Sort.launch_eclat_du_soleil(dice);
            case "nuee_de_meteores":
                return Sort.launch_nuee_de_meteores(dice);
            case "fleche_de_feu":
                return Sort.launch_fleche_de_feu(dice);
            default: throw new Error("echecSortNonTrouve");
        }
    }

    public static launch_rayon_de_givre(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("rayon_de_givre");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = valeur1 + valeur2 + valeur3;

        return resultat;

    }
    public static launch_tempete_de_grele(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("tempete_de_grele");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = (valeur1 + valeur2) * valeur3;

        return resultat;

    }
    public static launch_trait_ensorcele(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("trait_ensorcele");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = valeur1 + valeur2 + valeur3;

        return resultat;

    }
    public static launch_vague_tonnante(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("vague_tonnante");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = (valeur1 + valeur2) * valeur3;

        return resultat;

    }
    public static launch_boule_de_feu(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("boule_de_feu");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = (valeur1 * valeur2) + valeur3;

        return resultat;

    }
    public static launch_rayon_ardent(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("rayon_ardent");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = valeur1 + valeur2 + valeur3;

        return resultat;

    }
    public static launch_flamme_eternelle(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("flamme_eternelle");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = valeur1 + valeur2 + valeur3;

        return resultat;

    }
    public static launch_epee_de_feu(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("epee_de_feu");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = (valeur1 + valeur2) * valeur3;

        return resultat;

    }
    public static launch_eclair(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("eclair");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = (valeur1 + valeur2) * valeur3;

        return resultat;

    }
    public static launch_eclat_du_soleil(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("eclat_du_soleil");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = (valeur1 + valeur2) * valeur3;

        return resultat;

    }
    public static launch_nuee_de_meteores(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("nuee_de_meteores");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = (valeur1 + valeur2) * valeur3;

        return resultat;

    }
    public static launch_fleche_de_feu(dice: Array<[number,string]>): number{
        const chaines: string[] = [];
        const nombres: number[] = [];

        for (const [nombre, chaine] of dice) {
            chaines.push(chaine);
            nombres.push(nombre);
        }
        let s : Sort = new Sort("fleche_de_feu");
        if (!Sort.isCoutValide(s.getCout(), chaines)) {
            throw new Error("echecLancerSort");
        }
        if (nombres.length != 3) {
            throw new Error("echecLancerSort");
        }

        let valeur1 = nombres[0];
        let valeur2 = nombres[1];
        let valeur3 = nombres[2];

        let resultat = (valeur1 + valeur2) * valeur3;

        return resultat;

    }

    public static isCoutValide(couleurRequise: Array<string>, couleurEnvoye: Array<string>): boolean {
        if (couleurRequise.length != 3 || couleurEnvoye.length != 3) {
            throw new Error("L'array doit etre egale a 3");
        }
            if (couleurRequise.sort().toString() === couleurEnvoye.sort().toString()) {
                return true;
            }
        return false;
        }

    public static getName(id : string): string {
        return sort[id].name;
    }

    public static getDescription(id : string): string {
        return sort[id].description;
    }

    public static getDegats(id : string): string {
        return sort[id].degats;
    }

    public static getType(id: string): string{
        return sort[id].type;
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

    public getCout(): Array<string> {
        return this.cout;
    }

    public getAssociation(): string {
        return this.association;
    }
}