import { Effect, Schema } from 'effect'
import * as UserDb from '../db/users'
import { DatabaseService } from '../services/Database'
import { SessionService } from '../services/Session'
import { HashService } from '../services/Hash'
import * as Errors from '../lib/errors'
import { RegisterSchema, LoginSchema } from './schemas'

type AppServices = DatabaseService | SessionService | HashService

const parseJsonBody = (req: Request) =>
  Effect.tryPromise({
    try: () => req.json(),
    catch: () => new Errors.ValidationError({ message: 'Invalid JSON body' }),
  })

export const register = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const body = yield* parseJsonBody(req)

    const payload = yield* Schema.decodeUnknown(RegisterSchema)(body).pipe(
      Effect.mapError(
        () => new Errors.ValidationError({ message: 'Invalid input data' }),
      ),
    )

    const hasher = yield* HashService

    const passwordHash = yield* hasher.hash(payload.password)
    const user = yield* UserDb.createUser(payload.email, passwordHash)

    return Response.json({ userId: user.id }, { status: 201 })
  })

export const login = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const body = yield* parseJsonBody(req)

    const payload = yield* Schema.decodeUnknown(LoginSchema)(body).pipe(
      Effect.mapError(
        () => new Errors.ValidationError({ message: 'Invalid credentials' }),
      ),
    )

    const hasher = yield* HashService
    const session = yield* SessionService

    const user = yield* UserDb.findByEmail(payload.email).pipe(
      Effect.flatMap((u) =>
        u !== undefined
          ? Effect.succeed(u)
          : Effect.fail(new Errors.InvalidCredentialsError()),
      ),
    )

    yield* hasher.verify(payload.password, user.passwordHash).pipe(
      Effect.filterOrFail(
        (isValid) => isValid,
        () => new Errors.InvalidCredentialsError(),
      ),
    )

    const sessionId = yield* session.create(user.id)

    return new Response(null, {
      status: 200,
      headers: {
        'Set-Cookie': `session=${sessionId}; HttpOnly; Path=/; SameSite=Strict`,
      },
    })
  })

export const whoami = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const session = yield* SessionService

    const sessionId = yield* session
      .parseFromCookie(req.headers.get('Cookie'))
      .pipe(
        Effect.flatMap((id) =>
          id !== undefined
            ? Effect.succeed(id)
            : Effect.fail(new Errors.UnauthorizedError()),
        ),
      )

    const userId = yield* session
      .get(sessionId)
      .pipe(
        Effect.flatMap((id) =>
          id !== undefined
            ? Effect.succeed(id)
            : Effect.fail(new Errors.UnauthorizedError()),
        ),
      )

    return Response.json({ userId })
  })

export const logout = (
  req: Request,
): Effect.Effect<Response, Errors.AppError, AppServices> =>
  Effect.gen(function* () {
    const session = yield* SessionService

    const sessionId = yield* session.parseFromCookie(req.headers.get('Cookie'))
    if (sessionId !== undefined) {
      yield* session.delete(sessionId)
    }

    return new Response(null, {
      status: 200,
      headers: {
        'Set-Cookie': 'session=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0',
      },
    })
  })
