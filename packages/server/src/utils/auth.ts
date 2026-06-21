import { Effect } from 'effect'
import { SessionService } from '../services/Session'
import { UnauthorizedError } from '../lib/errors'

export const requireAuth = (req: Request): Effect.Effect<number, UnauthorizedError, SessionService> =>
  Effect.gen(function* () {
    const session = yield* SessionService

    const sessionId = yield* session.parseFromCookie(req.headers.get('Cookie')).pipe(
      Effect.flatMap((id) =>
        id !== undefined ? Effect.succeed(id) : Effect.fail(new UnauthorizedError()),
      ),
    )

    return yield* session.get(sessionId).pipe(
      Effect.flatMap((userId) =>
        userId !== undefined ? Effect.succeed(userId) : Effect.fail(new UnauthorizedError()),
      ),
    )
  })
