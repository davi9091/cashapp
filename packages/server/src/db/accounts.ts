import { Effect } from 'effect'
import { and, eq } from 'drizzle-orm'
import { accounts, groupMembers } from './schema'
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

// Returns the account only if the user is a member of its group — use this for auth checks.
export const findAccountForUser = (
  accountId: number,
  userId: number,
): Effect.Effect<Account | undefined, InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    return yield* Effect.try({
      try: () =>
        db
          .select({ id: accounts.id, groupId: accounts.groupId, name: accounts.name, type: accounts.type, currency: accounts.currency, balanceCents: accounts.balanceCents, isActive: accounts.isActive, createdAt: accounts.createdAt })
          .from(accounts)
          .innerJoin(groupMembers, eq(accounts.groupId, groupMembers.groupId))
          .where(and(eq(accounts.id, accountId), eq(groupMembers.userId, userId)))
          .get(),
      catch: (e) => new InternalServerError({ cause: e }),
    })
  })

export const listByGroup = (
  groupId: number,
): Effect.Effect<Account[], InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    return yield* Effect.try({
      try: () =>
        db.select().from(accounts).where(eq(accounts.groupId, groupId)).all(),
      catch: (e) => new InternalServerError({ cause: e }),
    })
  })
