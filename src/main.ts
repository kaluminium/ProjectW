import * as dotenv from 'dotenv';
import {Collection, Client, GatewayIntentBits} from "discord.js";
import {readdirSync} from "fs";
import {join} from "path";
import {SlashCommand} from "./types";
import {BDDConnexion} from "./models/BDDConnexion";



dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ]
})

client.slashCommands = new Collection<string, SlashCommand>();

const handlersDirs = join(__dirname, './handlers');

readdirSync(handlersDirs).forEach(file => {
    require(`${handlersDirs}/${file}`)(client);
})


BDDConnexion.getInstance()
    .then(() => {
        client.login(process.env.TOKEN);

    })
    .catch((error) => {
        console.error('Erreur lors de la connexion à la base de données :', error);
    });
