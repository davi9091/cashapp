import {Request, Router} from "express";
import {DatabaseSingleton} from "../helpers/DatabaseSingleton";
import {INotesBody} from "./types";
import {InsertOneWriteOpResult, MongoClient, MongoError, ObjectID, WithId} from "mongodb";

export const noteRouter = Router();
const dbErrorHandler = (error: MongoError, message: string) => ({error: {message: message, dbError: MongoError}});

noteRouter.get('/check_db', (req, res) => {
})

noteRouter.post('/note', async (req, res) => {
    const db = await DatabaseSingleton.getDbInstance();

    if (!('title' in req.body) || !('body' in req.body)) {
        res.send({error: 'wrong fields'});

        return;
    }

    const note: INotesBody = req.body;

    try {
        const result = await db.collection('notes').insertOne(note);
        res.send(result.ops[0]);
    } catch (error) {
        res.send({error: {message: 'an error occurred', dbError: error}});
    }
})

noteRouter.get('/note/:id', async (req, res) => {
    const noteId = req.params.id;
    const details = {'_id': new ObjectID(noteId)};
    const db = await DatabaseSingleton.getDbInstance();

    try {
        const note = await db.collection('notes').findOne(details)
        res.send(note);
    } catch (error) {
        res.send(dbErrorHandler(error, `an error occurred during reading ${noteId}`));
    }
})

noteRouter.delete('/note/:id', async (req, res) => {
    const noteId = req.params.id;
    const details = {'_id': new ObjectID(noteId)};
    const db = await DatabaseSingleton.getDbInstance();

    try {
        await db.collection('notes').deleteOne(details);
        res.send(`Note ${noteId} deleted`);
    } catch (error) {
        res.send(dbErrorHandler(error, `an error occurred during deleting ${noteId}`))
    }
})

noteRouter.put('/note/:id', async (req, res) => {
    const noteId = req.params.id,
        details = {'_id': new ObjectID(noteId)},
        db = await DatabaseSingleton.getDbInstance();

    if (!('title' in req.body) || !('body' in req.body)) {
        res.send({error: 'wrong fields'});

        return;
    }

    const note: INotesBody = req.body;

    try {
        await db.collection('notes').updateOne(details, {$set: note}, {upsert: false});
        res.send(`Note ${noteId} successfully updated`);
    } catch (error) {
        console.error(error);
        res.send(dbErrorHandler(error, `an error occurred during updating ${noteId}`));
    }
})
