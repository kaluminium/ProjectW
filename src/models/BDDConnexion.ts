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
        host: '5.189.129.40',
        user: 'kaluminium',
        password: 'Kalulebg69100/',
        database: 'projetw',
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

    public async query(query: string, values?: any | any[] | { [param: string]: any }): Promise<any> {
        try {
            const [rows] = await this.connection.query(query, values);
            return rows;
        } catch (error) {
            console.error('Erreur lors de la requête :', error);
            throw error;
        }
    }
}








