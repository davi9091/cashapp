import {Document, Model, model, MongooseDocument, Schema} from "mongoose";
import {INotesBody} from "../routes/types";

export const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    created: {
        type: Number,
        required: false,
    },
})

export const Note = model('Note', noteSchema);
