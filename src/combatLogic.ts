import {De} from "./models/De";
export class combatLogic{

    public static choixDeDuTour(poolDe : Array<De>) : Array<De> {

        //Copie le pool de dé pour ne pas le modifier directement puis le trie aléatoirement
        let copiePoolDe = poolDe.slice();
        copiePoolDe.sort(() => Math.random() - 0.5);

        //Renvoie les 6 premiers dés de l'array trié aléatoirement, pour l'instant 6 est hardcodé mais à terme sera
        //par une valeur passée en argument (toujours un multiple de 6, donc on prendra juste un n et on fera 6*n)
        //n correspondant au nombre de "citrons" que possède le personnage
        return copiePoolDe.slice(0, 6);
    }

    //A termes serait peut-être plus intéressant de transformer ça en sorte de dictionnaire, mais pour l'instant cela
    //ajoute une complexité que nous n'avons pas le temps de gérer
    public static lancerDeDuTour(deDuTour : Array<De>): Array<[number, string]>{

        //Crée un Array de tableau associant la valeur d'une face et sa couleur
        //Puis parcourt l'array de dé fournit en entrée, pour chaque dé, le lance
        //Puis l'ajoute à l'array
        let valeursDe : Array<[number, string]>;
        for (let de of deDuTour){
            valeursDe.push(de.lancerLeDe());
        }
        return valeursDe;
    }
}