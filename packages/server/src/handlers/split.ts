import { Effect, Schema } from 'effect'
import * as SplitDb from '../db/transactionSplits'
import * as Errors from '../lib/errors'
import { SessionService } from '../services/Session'
import { DatabaseService } from '../services/Database'
import { parseJsonBody } from '../utils/parse'
import { requireAuth } from '../utils/auth'

type AppServices = DatabaseService | SessionService

const SettleSchema = Schema.Struct({ splitId: Schema.Number })

export const outstanding = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)
    const splits = yield* SplitDb.listOutstandingForUser(userId)
    return Response.json(splits)
  })

export const settle = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)
    const body = yield* parseJsonBody(req)

    const { splitId } = yield* Schema.decodeUnknown(SettleSchema)(body).pipe(
      Effect.mapError(() => new Errors.ValidationError({ message: 'Invalid input' })),
    )

    yield* SplitDb.settle(splitId, userId)
    return new Response(null, { status: 204 })
  })
