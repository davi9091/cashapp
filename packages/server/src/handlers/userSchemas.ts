import { Schema } from 'effect'

export const RegisterSchema = Schema.Struct({
  email: Schema.String.pipe(
    Schema.filter((s): s is string => s.trim().length > 0 && s.includes('@'), {
      message: () => 'Must be a valid email address',
    }),
  ),
  password: Schema.String.pipe(Schema.minLength(8)),
  firstName: Schema.optional(Schema.String.pipe(Schema.minLength(1))),
  lastName: Schema.optional(Schema.String.pipe(Schema.minLength(1))),
})

export const LoginSchema = Schema.Struct({
  email: Schema.String,
  password: Schema.String,
})
