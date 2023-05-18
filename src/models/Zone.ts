const zone = require("../../zone.json.json");
const zoneTableau = require("../../tableauDeZone.json.json");

export class Zone {
    private id : string;
    private name : string;
    private description : string;

    constructor(id : string, name : string, description : string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

}