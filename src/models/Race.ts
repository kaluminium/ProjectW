

abstract class Race{
    private nom : string;
    private force : number;
    private intelligence : number;
    private agilite : number;
    private description : string;

    protected constructor(nom: string, force: number, intelligence: number, agilite: number, description: string) {
        this.nom = nom;
        this.force = force;
        this.intelligence = intelligence;
        this.agilite = agilite;
        this.description = description;
       // this.poolDeDes = poolDeDes;
    }
}