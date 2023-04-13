import {Personnage} from "./Personnage";
import {ListePersonnage} from "./ListePersonnage";
import * as bcrypt from "bcrypt";

class Compte{
    private id : number;
    private discordId : string;
    private accountName : string;
    private listPersonnage : ListePersonnage;

    constructor(discordId : string) {
        this.discordId = discordId;
    }

    public static checkCompliantPassword(password : string) : boolean{
        if(password.length < 8) return false;
        if(password.length > 30) return false;
        let regexMin : RegExp = new RegExp("[a-z]");
        let regexMaj : RegExp = new RegExp("[A-Z]");
        let regexNumber : RegExp = new RegExp("[0-9]");
        let regexSpecial : RegExp = new RegExp("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]");
        if(!regexMin.test(password)) return false;
        if(!regexMaj.test(password)) return false;
        if(!regexNumber.test(password)) return false;
        return regexSpecial.test(password);
    }

    public static checkCompliantAccountName(accountName : string) : boolean{
        if(accountName.length < 3) return false;
        if(accountName.length > 30) return false;
        let regex : RegExp = new RegExp("[a-zA-Z0-9]");
        return regex.test(accountName);
    }

    public static checkCompliantMail(mail : string) : boolean{
        let regex : RegExp = new RegExp("[a-zA-Z0-9@.]");
        return regex.test(mail);
    }

    public static isRegistered(discordId : string) : boolean{
        //TODO
        return false;
    }

    public static mailExist(mail : string) : boolean{
        //TODO
        return false;
    }

    public static accountNameExist(accountName : string) : boolean{
        //TODO
        return false;
    }

    public static register(discordId : string, accountName : string, password : string, mail : string) : number{
        if (Compte.isRegistered(discordId)) throw new Error("Vous avez déjà un compte");
        if (Compte.mailExist(mail)) throw new Error("Cette adresse mail est déjà utilisée");
        if (Compte.accountNameExist(accountName)) throw new Error("Ce nom de compte est déjà utilisé");
        if (!Compte.checkCompliantAccountName(accountName)) throw new Error("Le nom de compte n'est pas conforme");
        if (!Compte.checkCompliantMail(mail)) throw new Error("L'adresse mail n'est pas conforme");
        if (!Compte.checkCompliantPassword(password)) throw new Error("Le mot de passe n'est pas conforme");
        const id : number = 0 //TODO
        bcrypt
            .hash(password, 10)
            .then(hash => {
                console.log("\nLog[account] : Enregistrement de compte => " +
                    "\n\taccountId : " + id +
                    "\n\tdiscordId : " + discordId +
                    "\n\taccountName : " + accountName +
                    "\n\tmail : " + mail +
                    "\n\thash : " + hash);
            })
            .catch(err => console.error(err.message))
        //TODO
        return id;
    }
}

export{Compte};