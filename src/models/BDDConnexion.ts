import mysql from 'mysql2/promise';

export class BDDConnexion {
  private static instance: BDDConnexion;
  private connection: mysql.Connection;

  private constructor() {}

  public static async getInstance(): Promise<BDDConnexion> {
    if (!BDDConnexion.instance) {
      const instance = new BDDConnexion();
      await instance.connect();
      BDDConnexion.instance = instance;
    }
    return BDDConnexion.instance;
  }

  private async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection({
        host: 'sql928.main-hosting.eu',
        user: 'u578660070_projetw',
        password: 'Lu6!9lu1lu0Fa0IUT',
        database: 'u578660070_projetw',
      });
      console.log('Connexion à la base de données réussie !');
    } catch (error) {
      console.error('Erreur lors de la connexion à la base de données :', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.connection.end();
      console.log('Déconnexion à la base de données réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion à la base de données :', error);
      throw error;
    }
  }
}








