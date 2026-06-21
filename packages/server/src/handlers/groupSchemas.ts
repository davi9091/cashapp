import { Schema } from 'effect'

export const CreateSchema = Schema.Struct({
  name: Schema.String,
})