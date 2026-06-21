import { Effect } from 'effect'
import { accounts } from './schema'
import { InternalServerError } from '../lib/errors'
import { DatabaseService } from '../services/Database'

export type Account = typeof accounts.$inferSelect

export const createAccount = (
  name: string,
  groupId: number,
  type: Account['type'],
  currency: string,
): Effect.Effect<{ id: number }, InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService

    const rows = yield* Effect.try({
      try: () =>
        db
          .insert(accounts)
          .values({
            name,
            groupId,
            type,
            currency,
          })
          .returning({ id: accounts.id })
          .all(),
      catch: (error) => new InternalServerError({ cause: error }),
    })

    return rows[0] !== undefined
      ? rows[0]
      : yield* Effect.die(new Error('Insert returned no rows'))
  })
