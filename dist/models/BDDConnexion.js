"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BDDConnexion = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
class BDDConnexion {
    constructor() { }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!BDDConnexion.instance) {
                const instance = new BDDConnexion();
                yield instance.connect();
                BDDConnexion.instance = instance;
            }
            return BDDConnexion.instance;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield promise_1.default.createConnection({
                    host: 'sql928.main-hosting.eu',
                    user: 'u578660070_projetw',
                    password: 'Lu6!9lu1lu0Fa0IUT',
                    database: 'u578660070_projetw',
                });
                console.log('Connexion à la base de données réussie !');
            }
            catch (error) {
                console.error('Erreur lors de la connexion à la base de données :', error);
                throw error;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.end();
                console.log('Déconnexion à la base de données réussie');
            }
            catch (error) {
                console.error('Erreur lors de la déconnexion à la base de données :', error);
                throw error;
            }
        });
    }
}
exports.BDDConnexion = BDDConnexion;
