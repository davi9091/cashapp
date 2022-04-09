import { Document, Model, model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10

export interface IUserDoc extends Document<Schema.Types.ObjectId, unknown> {
  username: string
  password: string
  firstName: string
  defaultCurrencyId: string
  lastName?: string

  comparePasswords: <T>(
    candidatePassword: string,
    cb: (error: Error, match: T) => void,
  ) => T
}

export const userSchema: Schema<IUserDoc> = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(this.password, salt)

    this.password = hash
    next()
  } catch (e: any) {
    next(e)
  }
})

userSchema.methods.comparePasswords = async function (candidatePassword, cb) {
  const { password } = this

  try {
    const match = await bcrypt.compare(candidatePassword, password)
    cb(null, match)
  } catch (error) {
    return cb(error)
  }
}

export const User: Model<IUserDoc> = model('User', userSchema)
