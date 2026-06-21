import { Effect } from 'effect'
import { and, eq, isNull, sql } from 'drizzle-orm'
import { DatabaseService } from '../services/Database'
import { InternalServerError, UnauthorizedError } from '../lib/errors'
import { transactionSplits, transactions, accounts, groups } from './schema'

export type TransactionSplit = typeof transactionSplits.$inferSelect

export type OutstandingSplit = {
  id: number
  amountCents: number
  transactionId: number
  transactionDescription: string | null
  transactionDate: Date
  payerUserId: number
  accountName: string
  groupName: string
}

export const listByTransactionIds = (
  transactionIds: number[],
): Effect.Effect<TransactionSplit[], InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    if (transactionIds.length === 0) return []
    const { db } = yield* DatabaseService
    return yield* Effect.try({
      try: () =>
        db
          .select()
          .from(transactionSplits)
          .where(
            sql`${transactionSplits.transactionId} IN (${sql.join(transactionIds.map((id) => sql`${id}`), sql`, `)})`,
          )
          .all(),
      catch: (e) => new InternalServerError({ cause: e }),
    })
  })

export const listOutstandingForUser = (
  userId: number,
): Effect.Effect<OutstandingSplit[], InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    return yield* Effect.try({
      try: () =>
        db
          .select({
            id: transactionSplits.id,
            amountCents: transactionSplits.amountCents,
            transactionId: transactions.id,
            transactionDescription: transactions.description,
            transactionDate: transactions.date,
            payerUserId: transactions.createdByUserId,
            accountName: accounts.name,
            groupName: groups.name,
          })
          .from(transactionSplits)
          .innerJoin(transactions, eq(transactionSplits.transactionId, transactions.id))
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .innerJoin(groups, eq(accounts.groupId, groups.id))
          .where(
            and(
              eq(transactionSplits.userId, userId),
              isNull(transactionSplits.settledAt),
            ),
          )
          .all() as OutstandingSplit[],
      catch: (e) => new InternalServerError({ cause: e }),
    })
  })

export const settle = (
  splitId: number,
  userId: number,
): Effect.Effect<void, InternalServerError | UnauthorizedError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService

    const split = yield* Effect.try({
      try: () =>
        db
          .select()
          .from(transactionSplits)
          .where(eq(transactionSplits.id, splitId))
          .get(),
      catch: (e) => new InternalServerError({ cause: e }),
    })

    if (split === undefined || split.userId !== userId) {
      return yield* Effect.fail(new UnauthorizedError())
    }

    yield* Effect.try({
      try: () =>
        db
          .update(transactionSplits)
          .set({ settledAt: new Date() })
          .where(eq(transactionSplits.id, splitId))
          .run(),
      catch: (e) => new InternalServerError({ cause: e }),
    })
  })
