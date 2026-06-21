import { Schema } from 'effect'

const SplitSchema = Schema.Struct({
  userId: Schema.Number,
  amountCents: Schema.Number.pipe(Schema.positive()),
})

const CommonFields = {
  categoryId: Schema.optional(Schema.Number),
  amountCents: Schema.Number.pipe(Schema.positive()),
  description: Schema.optional(Schema.String),
  date: Schema.String, // ISO 8601 date string
  // splits represent what each other member owes the payer; must sum to ≤ amountCents
  splits: Schema.optional(Schema.Array(SplitSchema)),
}

export const CreateTransactionSchema = Schema.Union(
  Schema.Struct({
    type: Schema.Literal('income', 'expense'),
    accountId: Schema.Number,
    ...CommonFields,
  }),
  Schema.Struct({
    type: Schema.Literal('transfer'),
    fromAccountId: Schema.Number,
    toAccountId: Schema.Number,
    ...CommonFields,
  }),
)
