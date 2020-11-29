import express from 'express';
import {noteRouter} from "./routes";
import {MongoClient} from "mongodb";
import bodyParser from "body-parser";
import {dbConfig} from "./config/db";
import {DatabaseSingleton} from "./helpers/DatabaseSingleton";

const mongoClient = MongoClient;
const app = express();
const PORT = 3200;

app.use(bodyParser.urlencoded({extended: true}))
mongoClient.connect(dbConfig.url, (err, database) => {
    if (err) return console.log(err);

    DatabaseSingleton.setDb(database.db('notes'));

    app.use(noteRouter);
    app.listen(PORT, () => {
        console.log(`server is running at port ${PORT}`);
    });
})
