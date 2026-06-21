import { InternalServerError } from './../lib/errors'
import { Effect } from 'effect'
import { DatabaseService } from '../services/Database'
import { groups } from './schema'

export type Group = typeof groups.$inferSelect

export const createGroup = (
  name: string,
): Effect.Effect<{ id: number }, InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService

    const rows = yield* Effect.try({
      try: () =>
        db.insert(groups).values({ name }).returning({ id: groups.id }).all(),
      catch: (error) => new InternalServerError({ cause: error }),
    })

    return rows[0] !== undefined
      ? rows[0]
      : yield* Effect.die(new Error('Insert returned no rows'))
  })
