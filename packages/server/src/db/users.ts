import { Effect } from 'effect'
import { eq } from 'drizzle-orm'
import { users } from './schema'
import { DatabaseService } from '../services/Database'
import * as Errors from '../lib/errors'

export type User = typeof users.$inferSelect

export const findByEmail = (
  email: string,
): Effect.Effect<
  User | undefined,
  Errors.InternalServerError,
  DatabaseService
> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    return yield* Effect.try({
      try: () => db.select().from(users).where(eq(users.email, email)).get(),
      catch: (e) => new Errors.InternalServerError({ cause: e }),
    })
  })

export const createUser = (
  email: string,
  passwordHash: string,
  firstName?: string,
  lastName?: string,
): Effect.Effect<
  { id: number; email: string },
  Errors.UserAlreadyExistsError,
  DatabaseService
> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    const rows = yield* Effect.try({
      try: () =>
        db
          .insert(users)
          .values({ email, passwordHash, firstName, lastName })
          .returning({ id: users.id, email: users.email })
          .all(),
      catch: () => new Errors.UserAlreadyExistsError(),
    })
    return rows[0] !== undefined
      ? rows[0]
      : yield* Effect.die(new Error('Insert returned no rows'))
  })
