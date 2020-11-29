import {Request, Router} from "express";
import {DatabaseSingleton} from "../helpers/DatabaseSingleton";
import {INotesBody} from "./types";
import {InsertOneWriteOpResult, ObjectID, WithId} from "mongodb";

export const noteRouter = Router();

noteRouter.get('/check_db', (req, res) => {
})

noteRouter.post('/note', async (req, res) => {
    const db = DatabaseSingleton.getDbInstance();

    if (!('title' in req.body) || !('body' in req.body)) {
        res.send({error: 'wrong fields'});

        return;
    }

    const note: INotesBody = req.body;

    try {
        const result = await db.collection('notes').insertOne(note);
        res.send(result.ops[0]);
    } catch (error) {
        console.log(error);
        res.send({error: 'an error occurred'})
    }
})

noteRouter.get('/note/:id', async (req, res) => {
    const noteId = req.params.id;
    const details = {'_id': new ObjectID(noteId)};
    const db = DatabaseSingleton.getDbInstance();

    try {
        const note = await db.collection('notes').findOne(details)
        res.send(note);
    } catch (error) {
        console.log(error);
        res.send({error: {message: 'an error occured during reading', dbError: error}});
    }
})
