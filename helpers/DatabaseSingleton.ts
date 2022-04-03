import {Mongoose} from "mongoose";
export class DatabaseSingleton {
    private static _instance: Mongoose;

    public static setInstance(instance: Mongoose): void {
        this._instance = instance;
    }

    public static getInstance(): Mongoose {
        return this._instance;
    }

}
