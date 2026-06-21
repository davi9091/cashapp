import { Effect } from 'effect'
import { eq, desc, sql, inArray } from 'drizzle-orm'
import { DatabaseService } from '../services/Database'
import { InternalServerError } from '../lib/errors'
import { transactions, categories, transferPairs, accounts, transactionSplits } from './schema'

export type Transaction = typeof transactions.$inferSelect

export const create = (params: {
  accountId: number
  categoryId?: number
  amountCents: number
  type: 'income' | 'expense'
  description?: string
  date: Date
  createdByUserId: number
  splits?: { userId: number; amountCents: number }[]
}): Effect.Effect<{ id: number }, InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    const balanceDelta = params.type === 'income' ? params.amountCents : -params.amountCents
    return yield* Effect.try({
      try: () =>
        db.transaction((tx) => {
          const rows = tx
            .insert(transactions)
            .values(params)
            .returning({ id: transactions.id })
            .all()
          tx.update(accounts)
            .set({ balanceCents: sql`${accounts.balanceCents} + ${balanceDelta}` })
            .where(eq(accounts.id, params.accountId))
            .run()
          const id = rows[0]?.id
          if (id === undefined) throw new Error('Insert returned no rows')
          if (params.splits && params.splits.length > 0) {
            tx.insert(transactionSplits)
              .values(params.splits.map((s) => ({ ...s, transactionId: id })))
              .run()
          }
          return { id }
        }),
      catch: (e) => new InternalServerError({ cause: e }),
    })
  })

export const createTransfer = (params: {
  fromAccountId: number
  toAccountId: number
  categoryId?: number
  amountCents: number
  description?: string
  date: Date
  createdByUserId: number
}): Effect.Effect<{ fromId: number; toId: number }, InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    return yield* Effect.try({
      try: () =>
        db.transaction((tx) => {
          const common = {
            categoryId: params.categoryId,
            type: 'transfer' as const,
            description: params.description,
            date: params.date,
            createdByUserId: params.createdByUserId,
          }
          const fromRows = tx
            .insert(transactions)
            .values({ ...common, accountId: params.fromAccountId, amountCents: -params.amountCents })
            .returning({ id: transactions.id })
            .all()
          const toRows = tx
            .insert(transactions)
            .values({ ...common, accountId: params.toAccountId, amountCents: params.amountCents })
            .returning({ id: transactions.id })
            .all()

          const fromId = fromRows[0]?.id
          const toId = toRows[0]?.id
          if (fromId === undefined || toId === undefined) {
            throw new Error('Insert returned no rows')
          }
          tx.insert(transferPairs).values({ fromTransactionId: fromId, toTransactionId: toId }).run()
          tx.update(accounts)
            .set({ balanceCents: sql`${accounts.balanceCents} - ${params.amountCents}` })
            .where(eq(accounts.id, params.fromAccountId))
            .run()
          tx.update(accounts)
            .set({ balanceCents: sql`${accounts.balanceCents} + ${params.amountCents}` })
            .where(eq(accounts.id, params.toAccountId))
            .run()
          return { fromId, toId }
        }),
      catch: (e) => new InternalServerError({ cause: e }),
    })
  })

export const listByAccount = (
  accountId: number,
): Effect.Effect<
  {
    id: number
    accountId: number
    amountCents: number
    type: 'income' | 'expense' | 'transfer'
    description: string | null
    date: Date
    createdAt: Date
    categoryId: number | null
    categoryName: string | null
    categoryIcon: string | null
    categoryColor: string | null
    splits: { id: number; userId: number; amountCents: number; settledAt: Date | null }[]
  }[],
  InternalServerError,
  DatabaseService
> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService

    const rows = yield* Effect.try({
      try: () =>
        db
          .select({
            id: transactions.id,
            accountId: transactions.accountId,
            amountCents: transactions.amountCents,
            type: transactions.type,
            description: transactions.description,
            date: transactions.date,
            createdAt: transactions.createdAt,
            categoryId: categories.id,
            categoryName: categories.name,
            categoryIcon: categories.icon,
            categoryColor: categories.color,
          })
          .from(transactions)
          .leftJoin(categories, eq(transactions.categoryId, categories.id))
          .where(eq(transactions.accountId, accountId))
          .orderBy(desc(transactions.date))
          .all(),
      catch: (e) => new InternalServerError({ cause: e }),
    })

    if (rows.length === 0) return []

    const txIds = rows.map((r) => r.id)
    const splitRows = yield* Effect.try({
      try: () =>
        db
          .select()
          .from(transactionSplits)
          .where(inArray(transactionSplits.transactionId, txIds))
          .all(),
      catch: (e) => new InternalServerError({ cause: e }),
    })

    const splitsByTxId = new Map<number, typeof splitRows>()
    for (const split of splitRows) {
      const arr = splitsByTxId.get(split.transactionId) ?? []
      arr.push(split)
      splitsByTxId.set(split.transactionId, arr)
    }

    return rows.map((row) => ({
      ...row,
      splits: (splitsByTxId.get(row.id) ?? []).map((s) => ({
        id: s.id,
        userId: s.userId,
        amountCents: s.amountCents,
        settledAt: s.settledAt,
      })),
    }))
  })
