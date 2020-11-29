import {Db, MongoClient} from "mongodb";

export class DatabaseSingleton {
    private static _db: Db;

    public static setDb(db: Db) {
        this._db = db;
    }

    public static getDbInstance(): Db {
        return this._db || new Error('DB connection is not established');
    }
}

