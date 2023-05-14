export class De {
    private nomDuDe: string;
    private valeurFaces : number[];
    private couleurFaces : string[];
    private description : string;

    //Ne semble plus être une bonne idée
    //private tableauDeDe: FaceDeDes[];

    constructor(valeurs : number[], couleurs : string[], couleurPrincipale : string) {

        //Si l'array de valeurs passé en argument ne contient pas 6 valeurs, assigne [1, 2, 3, 4, 5, 6]
        //Sinon assigne les valeurs passées en argument
        if (!(valeurs.length == 6)){
            this.valeurFaces = [1, 2, 3, 4, 5, 6];
        }
        else {
            this.valeurFaces = valeurs;
        }

        //Si l'array de couleurs passé en argument ne contient pas 6 valeurs, assigne un array rempli de 6 fois la couleur principale
        //Sinon assigne les valeurs passées en argument
        if (!(couleurs.length == 6)){
            this.couleurFaces = [couleurPrincipale, couleurPrincipale, couleurPrincipale, couleurPrincipale, couleurPrincipale, couleurPrincipale];
        }
        else {
            this.couleurFaces = couleurs;
        }

    }

    //region ------ FONCTIONS LANCER DÉS ------

    //Tire une face au hasard puis récupére la valeur et la couleur de cette face
    //Puis renvoie la valeur et la couleur de la face tirée
    public lancerLeDe() : [number, string]{

        let index = this.tirerFace();

        let valeur = this.getValeurFace(index);
        let couleur = this.getCouleurFace(index);

        return [valeur, couleur];
    }

    //Choisis une face au hasard
    private tirerFace() : number{

        //Valeurs hardcodées car les dés ont forcément 6 faces
        let faceNumero = Math.floor(Math.random() * 6);

        return faceNumero;
    }
    //endregion

    //region ------ GETTERS ------
    //Récupère la valeur d'une face donnée
    private getValeurFace(index : number) : number{

        return this.valeurFaces[index] ;
    }

    //Récupère la couleur d'une face donnée
    private getCouleurFace(index : number) : string{

        return this.couleurFaces[index];
    }

    //Renvoie les valeurs du dé
    //Pas utilisé pour l'instant mais peut être utile plus tard à des fins de vérification
    public getValeurs() : number[]{

        //Retourne une copie de l'array valeurFaces
        // Cela évite de renvoyer une référence directement à l'attribut afin de respecter l'encapsulation
        return this.valeurFaces.slice();
    }

    //Renvoie les couleurs du dé
    //Pas utilisé pour l'instant mais peut être utile plus tard à des fins de vérification
    public getCouleurs() : string[]{

        //Retourne une copie de l'array couleurFaces
        // Cela évite de renvoyer une référence directement à l'attribut afin de respecter l'encapsulation
        return this.couleurFaces.slice();
    }
    //endregion

}

