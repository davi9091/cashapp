import { fundSchema, IFundDoc } from './fund'
import { Schema, Document, Model, model } from 'mongoose'

export interface IOperationDoc extends Document<Schema.Types.ObjectId, unknown> {
  fund: IFundDoc
  amount: number
  groupName: string
  creationDate: number
  label: string
}

const operationSchema: Schema<IOperationDoc> = new Schema({
  fund: fundSchema,
  groupName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  creationDate: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

export const Operation: Model<IOperationDoc> = model(
  'Operation',
  operationSchema,
)
