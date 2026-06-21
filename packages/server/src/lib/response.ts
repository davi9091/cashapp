import { Effect } from 'effect'
import * as Errors from './errors'

export const toHttpResponse = <R>(
  effect: Effect.Effect<Response, Errors.AppError, R>,
): Effect.Effect<Response, never, R> =>
  effect.pipe(
    Effect.catchTags({
      ValidationError: (e) =>
        Effect.succeed(Response.json({ error: e.message }, { status: 400 })),
      UserAlreadyExistsError: () =>
        Effect.succeed(
          Response.json({ error: 'User already exists' }, { status: 409 }),
        ),
      UserAlreadyMemberOfGroup: () =>
        Effect.succeed(
          Response.json({ error: 'User is already a member of this group' }, { status: 409 }),
        ),
      InvalidCredentialsError: () =>
        Effect.succeed(
          Response.json({ error: 'Invalid credentials' }, { status: 401 }),
        ),
      UnauthorizedError: () =>
        Effect.succeed(
          Response.json({ error: 'Unauthorized' }, { status: 401 }),
        ),
      InternalServerError: (e) =>
        Effect.sync(() => {
          console.error('Internal Server Error:', e.cause)
          return Response.json(
            { error: 'Internal server error' },
            { status: 500 },
          )
        }),
    }),
  )
