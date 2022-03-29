import {Router} from "express";
import {DatabaseSingleton} from "../helpers/DatabaseSingleton";
import {dbErrorHandler} from "../helpers/helpers";
import {Note} from "../models/note";
import HttpStatusCode from 'http-status-codes';
import {v4 as uuidv4} from 'uuid';
import {ObjectID, ObjectId} from "mongodb";

export const noteRouter = Router();

noteRouter.get('/notes', async (req, res) => {
    const mongoose = DatabaseSingleton.getInstance();

    try {
        const result = await Note.find({});
        res.send(result);
    } catch (error) {
        res.send(dbErrorHandler(error, 'error while getting notes'));
    }
})

noteRouter.post('/note', async (req, res) => {
    if (!('title' in req.body) || !('body' in req.body)) {
        res.send({error: 'wrong fields'});

        return;
    }

    const note = new Note({
        title: req.body.title,
        body: req.body.body,
        created: Date.now(),
        _id: new ObjectId(),
    });

    try {
        const saved = await note.save()
        res.send(note.toJSON());
    } catch (error) {
        console.error(error);
        res.status(HttpStatusCode.BAD_REQUEST);
        res.send(error);
    }

})

noteRouter.get('/note/:id', async (req, res) => {
    const noteId = req.params.id;
    const details = {'_id': new ObjectId(noteId)};

    try {
        const note = Note.findOne(details);
        res.send(note);
    } catch (error) {
        res.send(dbErrorHandler(error, `an error occurred during reading ${noteId}`));
    }
})

noteRouter.delete('/note/:id', async (req, res) => {
    const noteId = req.params.id;
    const details = {'_id': new ObjectId(noteId)};

    try {
        await Note.deleteOne(details);
        res.send(`Note ${noteId} deleted`);
    } catch (error) {
        res.send(dbErrorHandler(error, `an error occurred during deleting ${noteId}`))
    }
})

// noteRouter.put('/note/:id', async (req, res) => {
//     const noteId = req.params.id,
//         details = {'_id': new ObjectID(noteId)},
//         db = await DatabaseSingleton.getDbInstance();
//
//     if (!('title' in req.body) || !('body' in req.body)) {
//         res.send({error: 'wrong fields'});
//
//         return;
//     }
//
//     const note: INotesBody = req.body;
//
//     try {
//         await db.collection('notes').updateOne(details, {$set: note}, {upsert: false});
//         res.send(`Note ${noteId} successfully updated`);
//     } catch (error) {
//         console.error(error);
//         res.send(dbErrorHandler(error, `an error occurred during updating ${noteId}`));
//     }
// })
