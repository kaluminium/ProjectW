abstract class Divinite {
    private nom : string;
    private description : string;

    protected constructor(nom : string, description : string) {
        this.nom = nom;
        this.description = description;
    }

    public static getEmote(nom : string):string{
        if(nom == 'mountain') return ':mountain:';
        if(nom == 'ocean') return ':ocean:';
        if(nom == 'forest') return ':deciduous_tree:';
    }
}

export {Divinite}