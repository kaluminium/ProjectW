class Monstre {
    private type : string; // type du monstre ( boss, elite ,normal)
    private race : string; // race de monstre (gobelin, orc, mort vivant)  
    private nom : string; // composé d'un prefixe, d'un nom et d'un suffixe
    private description : string;
    private pv : number; // points de vie aleatoire compris entre un min et un max
    private sort : Array<string>; // tableau de sorts
    private inventaire : Array<string>; // loot du monstre


    protected constructor(nom : string, description : string) {
        this.nom = nom;
        this.description = description;
    }
}