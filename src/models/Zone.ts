const zone = require("../../zone.json");
const zoneTableau = require("../../tableauDeZone.json");
import {Personnage} from "./Personnage";
import {BDDConnexion} from "./BDDConnexion";

export class Zone {
    private id : string;
    private name : string;
    private description : string;

    constructor(id : string, name : string, description : string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    //fonction qui va calculer le temps pour voyager entre deux zones
    public static calculTemps(zoneD: string, zoneA : string) : number {
        let distance : number;
        let temps : number;
        let tableauDeZone : string[] = zoneTableau.zone.listeDeZone.map((zone : any) => zone.id);
        console.log(tableauDeZone);
        let indiceZoneD : number = this.trouverIndiceValeur(zoneD, tableauDeZone);
        let indiceZoneA : number = this.trouverIndiceValeur(zoneA, tableauDeZone);
        distance = Math.abs(indiceZoneA - indiceZoneD);
        temps = distance * 60000 // valeur d'une minute en milliseconde
        return temps;

    }
    public static trouverIndiceValeur(valeur : string, tableau: string[]): number | null {
        for (let i = 0; i < tableau.length; i++) {
            if (tableau[i] === valeur) {
                return i;
            }
        }
        return null;
    }

    public static changerDeZoneEtMajTimer(personnage : Personnage,time : number ,zoneA : string) : void {
        Zone.ajoutTempsActuel(personnage,time);
        Zone.ajoutTempsDisponible(personnage,time,zoneA);
        Zone.changerZone(personnage,zoneA);

    }
    // fonction qui ajoute le temps au moment du lancer de la commande
     public static async ajoutTempsActuel(personnage : Personnage, time : number) : Promise<void> {
        const id = personnage.getId();
         const bdd = await BDDConnexion.getInstance();
        try {
            const query = 'UPDATE personnage SET timerActuel = ? WHERE id = ?';
            // Exécution de la requête SQL
            await bdd.query(query,[time, id]);
            console.log(`L'enregistrement avec l'id ${id} a ete mis à jour avec le nouveau timerActuel : ${time}`);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'enregistrement :', error);
        }
    }
    public  static  async  ajoutTempsDisponible(personnage : Personnage, time : number ,zoneA : string) : Promise<void> {
        const id = personnage.getId();
        let temps : number = this.calculTemps(personnage.getZone(), zoneA) + time;
        const bdd = await BDDConnexion.getInstance();
        try {
            const query = 'UPDATE personnage SET timerDisponible = ? WHERE id = ?';
            // Exécution de la requête SQL
            await bdd.query(query,[temps, id]);
            console.log(`L'enregistrement avec l'id ${id} a ete mis à jour avec le nouveau timerDisponible : ${temps}`);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'enregistrement :', error);
        }
    }

    // fonction changer de zone
    public static async changerZone(personnage: Personnage, zoneA: string): Promise<void> {
        const id = personnage.getId();
        const bdd = await BDDConnexion.getInstance();
        try {
            const query = 'UPDATE personnage SET zone = ? WHERE id = ?';

            await bdd.query(query, [zoneA, id]);
            console.log(`L'enregistrement avec l'id ${id} a été mis à jour avec la nouvelle zone : ${zoneA}`);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'enregistrement :', error);
        }
    }


    // fonction qui va verifier si le personnage peut faire des actions
    public static verificationTimer(personnage : Personnage, time : number) : boolean {
        let timerDisponible : number = personnage.getTimerDisponible();
        let timeRestant : number =  timerDisponible - time
        if (timeRestant > 0){
            return false;
        }else {
            return true;
        }

    }
    // fonction qui verifier si le personnage est dans la bonne zone
    public verificationZone(p : Personnage, zone : string) : boolean {
        if (p.getZone() === zone){
            return true;
        }else {
            return false;
        }
    }

}