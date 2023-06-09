import {Personnage} from "./Personnage";
import {ListePersonnage} from "./ListePersonnage";
import * as bcrypt from "bcrypt";
import {BDDConnexion} from "./BDDConnexion";

class Compte{
    private id : number;
    private discordId : string;
    private accountName : string;
    private readonly listPersonnage : ListePersonnage;
    private selectedPersonnage : Personnage;

    private constructor(discordId : string, accountName : string, listPersonnage : ListePersonnage, id : number, selectedPersonnage : Personnage) {
        this.discordId = discordId;
        this.accountName = accountName;
        this.listPersonnage = listPersonnage;
        this.id = id;
        this.selectedPersonnage = selectedPersonnage;
    }

    public static async getAccount(discordId : string) : Promise<Compte>{
        const bdd = await BDDConnexion.getInstance();
        const query = "SELECT * FROM compte WHERE discord_id = ?";
        const result = await bdd.query(query, [discordId]);
        if (result.length == 0) throw new Error("Vous n'avez pas de compte");
        const listPersonnage = await ListePersonnage.getListePersonnage(result[0].id);
        let selectedPersonnage = null;
        if(result[0].selected_character != null) selectedPersonnage = await Personnage.getPersonnage(result[0].selected_character);
        return new Compte(result[0].discord_id, result[0].account_name, listPersonnage, result[0].id, selectedPersonnage);
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

    public static async isRegisteredDiscord(discordId : string) : Promise<boolean>{
        const bdd = await BDDConnexion.getInstance();
        const query = "SELECT * FROM compte WHERE discord_id = ?";
        const result =  await bdd.query(query, [discordId]);
        return result.length > 0;
    }

    public static async isRegisteredMail(mail : string) : Promise<boolean>{
        const bdd = await BDDConnexion.getInstance();
        const query = "SELECT * FROM compte WHERE mail = ?";
        const result =  await bdd.query(query, [mail]);
        return result.length > 0;
    }

    public static async isRegisteredAccount(accountName : string) : Promise<boolean>{
        const bdd = await BDDConnexion.getInstance();
        const query = "SELECT * FROM compte WHERE account_name = ?";
        const result =  await bdd.query(query, [accountName]);
        return result.length > 0;
    }

    public static async getLastId() : Promise<number>{
        const bdd = await BDDConnexion.getInstance();
        const query = "SELECT MAX(id) FROM compte";
        const result = await bdd.query(query);
        return result[0]["MAX(id)"];
    }

    public static async register(discordId : string, accountName : string, password : string, mail : string) : Promise<number>{
        if (await Compte.isRegisteredDiscord(discordId)) throw new Error("Vous avez déjà un compte");
        if (await Compte.isRegisteredMail(mail)) throw new Error("Cette adresse mail est déjà utilisée");
        if (await Compte.isRegisteredAccount(accountName)) throw new Error("Ce nom de compte est déjà utilisé");
        if (!Compte.checkCompliantAccountName(accountName)) throw new Error("Le nom de compte n'est pas conforme");
        if (!Compte.checkCompliantMail(mail)) throw new Error("L'adresse mail n'est pas conforme");
        if (!Compte.checkCompliantPassword(password)) throw new Error("Le mot de passe n'est pas conforme");
        const id : number = await this.getLastId() + 1;
        let hash : string = await bcrypt.hash(password, 10)
        console.log("\nLog[account] : Enregistrement de compte => " +
            "\n\taccountId : " + id +
            "\n\tdiscordId : " + discordId +
            "\n\taccountName : " + accountName +
            "\n\tmail : " + mail +
            "\n\thash : " + hash);
        const bdd = await BDDConnexion.getInstance()
        await bdd.query("INSERT INTO `compte` (`discord_id`, `account_name`, `mail`, `hash`) VALUES (?, ?, ?, ?)", [discordId, accountName, mail, hash]);
        return id;
    }

    public getListPersonnage() : ListePersonnage{
        return this.listPersonnage;
    }

    public getId() : number{
        return this.id;
    }

    public async getSelectedPersonnage(): Promise<Personnage> {
        if(this.selectedPersonnage == null) return null;
        return await Personnage.getPersonnage(this.selectedPersonnage.getId());
    }

    public async changeSelectedPersonnage(personnage : Personnage) : Promise<void>{
        const bdd = await BDDConnexion.getInstance();
        await bdd.query("UPDATE compte SET selected_character = ? WHERE id = ?", [personnage.getId(), this.id]);
        this.selectedPersonnage = personnage;
    }
}

export{Compte};