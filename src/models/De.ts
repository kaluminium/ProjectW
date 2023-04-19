import {FaceDeDes} from "./FaceDeDes";
class De {
    private nomDuDe: string;
    private faces :{[Key:number]: {valeur : number; couleur : string}};
    private description : string;

    //Finalement on va plutôt utiliser un dictionnaire alliant couleur et valeur plutôt que des face de dés
    //private tableauDeDe: FaceDeDes[];

    private constructor(valeurs : number[], couleurs : string[], couleurPrincipale : string) {

        if (!(valeurs.length == 6 && couleurs.length == 6)) {
            this.faces = {
                1: {valeur: 1, couleur: couleurs[0]},
                2: {valeur: 2, couleur: couleurs[1]},
                3: {valeur: 3, couleur: couleurs[2]},
                4: {valeur: 4, couleur: couleurs[3]},
                5: {valeur: 5, couleur: couleurs[4]},
                6: {valeur: 6, couleur: couleurs[5]},
            }
        } else {
            this.faces = {
                1: {valeur: valeurs[0], couleur: couleurPrincipale},
                2: {valeur: valeurs[1], couleur: couleurPrincipale},
                3: {valeur: valeurs[2], couleur: couleurPrincipale},
                4: {valeur: valeurs[3], couleur: couleurPrincipale},
                5: {valeur: valeurs[4], couleur: couleurPrincipale},
                6: {valeur: valeurs[5], couleur: couleurPrincipale},
            }
        }

    }

    private getFaceNumero(index : number) : [number, string]{
        let valeursFaces = Object.values(this.faces);
        let element = valeursFaces[index];

        let {valeur, couleur} = element;

        return [valeur, couleur];
    }

    public lancerLeDe() : [number, string] {

        //Pour l'instant les valeurs sont hardcoder parce que les dés ont forcément 6 faces mais va potentiellement changer
        let faceNumero = Math.floor(Math.random() * (5 - 0 + 1) + 0);

        return this.getFaceNumero(faceNumero);
    }
}

