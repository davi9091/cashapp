import {Db, MongoClient} from "mongodb";
import {Mongoose} from "mongoose";
//
// export class DatabaseSingleton {
//     private static _db: Db;
//     private static _client: MongoClient;
//
//     public static setClient(client: MongoClient, dbName: string): void {
//         this._client = client;
//         this._db = client.db(dbName);
//     }
//
//     public static async getDbInstance(): Promise<Db> {
//         if (!this._client.isConnected()) {
//             try {
//                 await this._client.connect();
//             } catch (err) {
//                 throw err;
//             }
//         }
//
//         return this._db || new Error('DB connection is not established');
//     }
// }
//

export class DatabaseSingleton {
    private static _instance: Mongoose;

    public static setInstance(instance: Mongoose): void {
        this._instance = instance;
    }

    public static getInstance(): Mongoose {
        return this._instance;
    }

}
