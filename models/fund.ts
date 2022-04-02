import { Schema, Document, Model, model } from "mongoose";
import { User, userSchema } from "./user";

export interface IFundDoc extends Document<Schema.Types.ObjectId, {}> {
  owner: typeof User;
  currencyId: string;
  amount: number;
  name?: string;
}

const fundSchema: Schema<IFundDoc> = new Schema({
  owner: userSchema,
  currencyId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
});

export const Fund: Model<IFundDoc> = model("Fund", fundSchema);
