abstract class Divinite {
    private nom: string;
    private description: string;

    constructor(nom: string, description: string) {
        this.nom = nom;
        this.description = description;
    }

    public abstract getBonus(): number;

    public getNom(): string {
        return this.nom;
    }

    public getDescription(): string {
        return this.description;
    }
}