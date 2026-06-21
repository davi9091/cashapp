import { Effect } from 'effect'
import * as AccountDb from '../db/accounts'
import * as GroupMemberDb from '../db/groupMembers'
import * as Errors from '../lib/errors'
import { SessionService } from '../services/Session'
import { DatabaseService } from '../services/Database'
import { requireAuth } from '../utils/auth'

type AppServices = DatabaseService | SessionService

const requireGroupAccess = (
  groupId: number,
  userId: number,
): Effect.Effect<void, Errors.AppError, DatabaseService> =>
  GroupMemberDb.findMembership(groupId, userId).pipe(
    Effect.flatMap((m) =>
      m !== undefined ? Effect.void : Effect.fail(new Errors.UnauthorizedError()),
    ),
  )

export const list = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)

    const groupId = Number(new URL(req.url).searchParams.get('groupId'))
    if (!Number.isInteger(groupId) || groupId <= 0) {
      return yield* Effect.fail(
        new Errors.ValidationError({ message: 'Missing or invalid groupId' }),
      )
    }

    yield* requireGroupAccess(groupId, userId)

    const rows = yield* AccountDb.listByGroup(groupId)
    return Response.json(rows)
  })
