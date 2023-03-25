"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
module.exports = (client) => {
    let eventsDir = (0, path_1.join)(__dirname, '../events');
    (0, fs_1.readdirSync)(eventsDir).forEach(file => {
        if (!file.endsWith('.js'))
            return;
        let event = require(`${eventsDir}/${file}`).default;
        event.once
            ? client.once(event.name, (...args) => event.execute(...args, client))
            : client.on(event.name, (...args) => event.execute(...args, client));
        console.log(`L'évènement ${event.name} a été chargé !`);
    });
};
