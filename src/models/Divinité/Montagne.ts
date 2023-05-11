import {Divinite} from "../Divinite";

class Montagne extends Divinite {
// 4 Dice Green 2 Dice Red
    constructor() {
        super("Montagne", "Dieu de la terre");
    }

    public getBonus() {
        return 5;
    }
}