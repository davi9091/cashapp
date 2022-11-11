import { Schema, Document, model, Model } from 'mongoose'

export interface IDefaultGroupDoc
  extends Document<Schema.Types.ObjectId, unknown> {
  name: string
  emoji: string
  isDefault: true
}

const defaultOpGroupSchema: Schema<IDefaultGroupDoc> = new Schema({
  name: {
    type: String,
    require: true,
  },
  emoji: {
    type: String,
    require: true,
  },
  isIncome: {
    type: Boolean,
    require: true,
  },
})

export const DefaultOpGroup: Model<IDefaultGroupDoc> = model(
  'DefaultOpGroup',
  defaultOpGroupSchema,
)
