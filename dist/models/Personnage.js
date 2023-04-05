"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personnage = void 0;
class Personnage {
    constructor(name, divinity, race, sex) {
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    static verifyName(name) {
        if (name.length < 3 || name.length > 16)
            return false;
        return !!name.match(/^[a-zA-Z]+$/);
    }
    static putCapitalLetter(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
}
exports.Personnage = Personnage;
