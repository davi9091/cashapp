import {Db, MongoClient} from "mongodb";

export class DatabaseSingleton {
    private static _db: Db;
    private static _client: MongoClient;

    public static setClient(client: MongoClient, dbName: string): void {
        this._client = client;
        this._db = client.db(dbName);
    }

    public static async getDbInstance(): Promise<Db> {
        if (!this._client.isConnected()) {
            await this._client.connect();
        }

        return this._db || new Error('DB connection is not established');
    }
}

