import { Schema, Document, model, Model } from 'mongoose'
import { IUserDoc, userSchema } from './user'

export interface ICustomOpGroupDoc
  extends Document<Schema.Types.ObjectId, unknown> {
  owner: IUserDoc
  name: string
  emoji: string
  isDefault: false
  isIncome: boolean
}

const customOpGroupSchema: Schema<ICustomOpGroupDoc> = new Schema({
  owner: userSchema,
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

export const CustomOpGroup: Model<ICustomOpGroupDoc> = model(
  'CustomOpGroup',
  customOpGroupSchema,
)
