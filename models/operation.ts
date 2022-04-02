import { Schema, Document, Model, model } from "mongoose";
import { User, userSchema } from "./user";

export interface IOperationDoc extends Document<Schema.Types.ObjectId, {}> {
  owner: typeof User;
  amount: number;
  groupName: string;
  label: string;
}

const fundSchema: Schema<IOperationDoc> = new Schema({
  owner: userSchema,
  groupName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

export const Operation: Model<IOperationDoc> = model("Operation", fundSchema);
