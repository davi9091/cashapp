import {model, Schema} from "mongoose";

export const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    created: {
        type: Number,
        required: false,
    },
})

export const Note = model('Note', noteSchema);
