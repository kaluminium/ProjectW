import {Client, REST, Routes, SlashCommandBuilder} from "discord.js";
import {join} from "path";
import {readdirSync} from "fs";
import  {SlashCommand} from "../types";


module.exports = async (client : Client) => {
    const body = [];
    let slashCommandsDir = join(__dirname, '../slashCommands');

    readdirSync(slashCommandsDir).forEach(file => {
        if (!file.endsWith('.js')) return;

        const command: SlashCommand = require(`${slashCommandsDir}/${file}`).command;
        let commandData = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);

        if (command.options) {
            for (let i = 0; i < command.options.length; i++) {
                let type = command.options[i].type.slice(0, 1).toUpperCase()+command.options[i].type.slice(1).toLowerCase();
                let name = command.options[i].name;
                let description = command.options[i].description;
                let required = command.options[i].required;
                commandData[`add${type}Option`](option => option.setName(name).setDescription(description).setRequired(required));
            }
        }

        body.push(commandData.toJSON());
        client.slashCommands.set(command.name, command);
    });

    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID),{body: body})
            .then(() => console.log('Les slash commands ont été chargées !'));
    }catch (error){
        console.error(error);
    }
}