import { Effect, Schema } from 'effect'
import * as TransactionDb from '../db/transactions'
import * as AccountDb from '../db/accounts'
import * as Errors from '../lib/errors'
import { CreateTransactionSchema } from './transactionSchemas'
import { SessionService } from '../services/Session'
import { DatabaseService } from '../services/Database'
import { parseJsonBody } from '../utils/parse'
import { requireAuth } from '../utils/auth'

type AppServices = DatabaseService | SessionService

const requireAccountAccess = (
  accountId: number,
  userId: number,
): Effect.Effect<void, Errors.AppError, DatabaseService> =>
  AccountDb.findAccountForUser(accountId, userId).pipe(
    Effect.flatMap((account) =>
      account !== undefined
        ? Effect.void
        : Effect.fail(new Errors.UnauthorizedError()),
    ),
  )

export const list = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)

    const accountId = Number(new URL(req.url).searchParams.get('accountId'))
    if (!Number.isInteger(accountId) || accountId <= 0) {
      return yield* Effect.fail(
        new Errors.ValidationError({ message: 'Missing or invalid accountId' }),
      )
    }

    yield* requireAccountAccess(accountId, userId)

    const rows = yield* TransactionDb.listByAccount(accountId)
    return Response.json(rows)
  })

export const create = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)
    const body = yield* parseJsonBody(req)

    const payload = yield* Schema.decodeUnknown(CreateTransactionSchema)(body).pipe(
      Effect.mapError(() => new Errors.ValidationError({ message: 'Invalid input' })),
    )

    const date = new Date(payload.date)
    if (isNaN(date.getTime())) {
      return yield* Effect.fail(
        new Errors.ValidationError({ message: 'Invalid date' }),
      )
    }

    if (payload.type === 'transfer') {
      yield* requireAccountAccess(payload.fromAccountId, userId)
      yield* requireAccountAccess(payload.toAccountId, userId)

      const { fromId, toId } = yield* TransactionDb.createTransfer({
        fromAccountId: payload.fromAccountId,
        toAccountId: payload.toAccountId,
        categoryId: payload.categoryId,
        amountCents: payload.amountCents,
        description: payload.description,
        date,
        createdByUserId: userId,
      })
      return Response.json({ fromId, toId }, { status: 201 })
    }

    yield* requireAccountAccess(payload.accountId, userId)

    if (payload.splits && payload.splits.length > 0) {
      const splitTotal = payload.splits.reduce((sum, s) => sum + s.amountCents, 0)
      if (splitTotal > payload.amountCents) {
        return yield* Effect.fail(
          new Errors.ValidationError({ message: 'Split amounts exceed transaction total' }),
        )
      }
    }

    const tx = yield* TransactionDb.create({
      accountId: payload.accountId,
      categoryId: payload.categoryId,
      amountCents: payload.amountCents,
      type: payload.type,
      description: payload.description,
      date,
      createdByUserId: userId,
      splits: payload.splits ? [...payload.splits] : undefined,
    })
    return Response.json({ id: tx.id }, { status: 201 })
  })
