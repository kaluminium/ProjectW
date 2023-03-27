class FaceDeDes{
    private _type : number;
    private _valeur : number;
    private _description : string;


    constructor(type: number, valeur: number, description: string) {
        this._type = type;
        this._valeur = valeur;
        this._description = description;
    }



    set type(value: number) {
        this._type = value;
    }

    set valeur(value: number) {
        this._valeur = value;
    }

    set description(value: string) {
        this._description = value;
    }


}