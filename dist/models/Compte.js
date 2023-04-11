"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compte = void 0;
const bcrypt = __importStar(require("bcrypt"));
class Compte {
    constructor(discordId) {
        this.discordId = discordId;
    }
    static checkCompliantPassword(password) {
        if (password.length < 8)
            return false;
        if (password.length > 30)
            return false;
        let regexMin = new RegExp("[a-z]");
        let regexMaj = new RegExp("[A-Z]");
        let regexNumber = new RegExp("[0-9]");
        let regexSpecial = new RegExp("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]");
        if (!regexMin.test(password))
            return false;
        if (!regexMaj.test(password))
            return false;
        if (!regexNumber.test(password))
            return false;
        return regexSpecial.test(password);
    }
    static checkCompliantAccountName(accountName) {
        if (accountName.length < 3)
            return false;
        if (accountName.length > 30)
            return false;
        let regex = new RegExp("[a-zA-Z0-9]");
        return regex.test(accountName);
    }
    static checkCompliantMail(mail) {
        let regex = new RegExp("[a-zA-Z0-9@.]");
        return regex.test(mail);
    }
    static isRegistered(discordId) {
        //TODO
        return false;
    }
    static register(discordId, accountName, password, mail) {
        if (Compte.isRegistered(discordId))
            throw new Error("Vous avez déjà un compte");
        if (!Compte.checkCompliantAccountName(accountName))
            throw new Error("Le nom de compte n'est pas conforme");
        if (!Compte.checkCompliantMail(mail))
            throw new Error("L'adresse mail n'est pas conforme");
        if (!Compte.checkCompliantPassword(password))
            throw new Error("Le mot de passe n'est pas conforme");
        bcrypt
            .hash(password, 10)
            .then(hash => {
            console.log("Enregistrement de compte => " + discordId + ":" + accountName + ":" + mail + ":" + hash);
        })
            .catch(err => console.error(err.message));
        //TODO
        return 0;
    }
}
exports.Compte = Compte;
