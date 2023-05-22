import {SlashCommand} from "../types";
import {Compte} from "../models/Compte";
import {Personnage} from "../models/Personnage";
import {ListePersonnage} from "../models/ListePersonnage";
import {Zone} from "../models/Zone";

export const command: SlashCommand = {
    name: "heal",
    usage: "",
    category: "gameplay",
    description: "Permet se soigner",

    execute: async (interaction) => {

        //region ------ VERIFICATIONS VALIDITE COMMANDE ------

        let compte: Compte;

        //Récupère le compte du joueur
        //Erreur(s) possible :
        //- L'utilisateur n'a pas de compte : gérée, indique à l'utilisateur qu'il n'a pas de compte et lui propose d'en créer un
        try {
            compte = await Compte.getAccount(interaction.user.id)
        } catch (e) {
            return await interaction.reply({
                content: `Vous n'avez pas de compte, faites /creation_compte pour créer un compte`,
                ephemeral: true
            });
        }
        //Récupère la liste de personnages du compte
        //Puis vérifie que l'utilisateur a des personnages, sinon lui propose d'en créer un puis de le sélectionner
        const listePersonnages : ListePersonnage = await compte.getListPersonnage();
        if(listePersonnages.isEmpty()) return await interaction.reply({
            content: `Vous n'avez pas de personnage, faites /creation_personnage pour créer un personnage,
            \npuis /select_personnage pour sélectionner un personnage`,
            ephemeral: true
        });

        //Récupère le personnage sélectionné du compte
        //Puis vérifie que l'utilisateur a un personnage sélectionné, sinon lui propose d'en sélectionner un
        const selectedPersonnage : Personnage = await compte.getSelectedPersonnage();
        if(selectedPersonnage == null) return await interaction.reply({
            content: `Vous n'avez pas de personnage sélectionné, faites /select_personnage pour sélectionner un personnage`,
            ephemeral: true
        });
        //endregion

        //region ------ SOIN ------
        if (!Zone.verificationZone(selectedPersonnage, "village")){
            return interaction.reply({content: "Vous devez etre au village pour vous soigner", ephemeral: true});
        }
        //TODO ajouter dans la bdd les pv
        selectedPersonnage.soignerDegats(25);//Valeurs hardcodée temporaire, pleins de possibilités de comment gérer cela
        await interaction.reply({content: 'Vous vous êtes soigné'});

        //endregion
    }
}