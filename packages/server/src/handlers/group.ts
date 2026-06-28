import { Effect, Schema } from 'effect'
import * as GroupDb from '../db/groups'
import * as GroupMemberDb from '../db/groupMembers'
import * as AccountDb from '../db/accounts'
import * as Errors from '../lib/errors'
import { CreateSchema } from './groupSchemas'
import { SessionService } from '../services/Session'
import { DatabaseService } from '../services/Database'
import { parseJsonBody } from '../utils/parse'
import { requireAuth } from '../utils/auth'

type AppServices = DatabaseService | SessionService

export const listMembers = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)

    const groupId = Number(new URL(req.url).searchParams.get('groupId'))
    if (!Number.isInteger(groupId) || groupId <= 0) {
      return yield* Effect.fail(new Errors.ValidationError({ message: 'Missing or invalid groupId' }))
    }

    yield* GroupMemberDb.findMembership(groupId, userId).pipe(
      Effect.flatMap((m) =>
        m !== undefined ? Effect.void : Effect.fail(new Errors.UnauthorizedError()),
      ),
    )

    const members = yield* GroupMemberDb.listByGroupWithUsers(groupId)
    return Response.json(members)
  })

export const list = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)
    const groups = yield* GroupDb.listGroupsForUser(userId)
    return Response.json(groups)
  })

export const create = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)

    const body = yield* parseJsonBody(req)

    const payload = yield* Schema.decodeUnknown(CreateSchema)(body).pipe(
      Effect.mapError(
        () => new Errors.ValidationError({ message: 'Invalid input' }),
      ),
    )

    const group = yield* GroupDb.createGroup(payload.name)
    const groupMember = yield* GroupMemberDb.addMember(
      group.id,
      userId,
      'owner',
    )
    const account = yield* AccountDb.createAccount(
      'Default',
      group.id,
      'cash',
      '€',
    )

    return Response.json(
      {
        groupId: group.id,
        groupMemberId: groupMember.id,
        accountId: account.id,
      },
      { status: 201 },
    )
  })
