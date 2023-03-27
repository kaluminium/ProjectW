class FaceDeDes {
    constructor(type, valeur, description) {
        this._type = type;
        this._valeur = valeur;
        this._description = description;
    }
    set type(value) {
        this._type = value;
    }
    set valeur(value) {
        this._valeur = value;
    }
    set description(value) {
        this._description = value;
    }
}
