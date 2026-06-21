import { Effect, Schema } from 'effect'
import * as GroupDb from '../db/groups'
import * as GroupMemberDb from '../db/groupMembers'
import * as Errors from '../lib/errors'
import { CreateSchema } from './groupSchemas'
import { SessionService } from '../services/Session'
import { DatabaseService } from '../services/Database'
import { parseJsonBody } from '../utils/parse'
import { requireAuth } from '../utils/auth'

export const create = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, DatabaseService | SessionService> =>
  Effect.gen(function* () {
    const userId = yield* requireAuth(req)

    const body = yield* parseJsonBody(req)

    const payload = yield* Schema.decodeUnknown(CreateSchema)(body).pipe(
      Effect.mapError(
        () => new Errors.ValidationError({ message: 'Invalid input' }),
      ),
    )

    const group = yield* GroupDb.createGroup(payload.name)
    const groupMember = yield* GroupMemberDb.addMember(group.id, userId, 'owner')

    return Response.json(
      { groupId: group.id, groupMemberId: groupMember.id },
      { status: 201 },
    )
  })
