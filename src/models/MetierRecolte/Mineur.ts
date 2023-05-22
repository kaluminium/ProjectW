import {Personnage} from "../Personnage";
import {BDDConnexion} from "../BDDConnexion";
import {Ressource} from "../Ressource";


export class Mineur{



    public static nombreDeMinerai(nombre : number) : number{
        switch (nombre) {
            case 10:
                return 10 * 2;
                break;
            case 20:
                return 20 * 3;
                break;
            case 30:
                return  30 * 4;
                break;
        }
    }
    public static async ajoutBDDMinerai(perso : Personnage,nombre : number) {
        const bdd = await BDDConnexion.getInstance();
        let ressource = new Ressource(perso, "minerai_de_fer", nombre);
        await Ressource.addRessourceBDD(ressource);
}

}