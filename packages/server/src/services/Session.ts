import { Effect } from 'effect'

export class SessionService extends Effect.Service<SessionService>()(
  'SessionService',
  {
    sync: () => {
      const sessions = new Map<string, number>()

      return {
        create: (userId: number): Effect.Effect<string> =>
          Effect.sync(() => {
            const sessionId = crypto.randomUUID()
            sessions.set(sessionId, userId)
            return sessionId
          }),

        get: (sessionId: string): Effect.Effect<number | undefined> =>
          Effect.sync(() => sessions.get(sessionId)),

        delete: (sessionId: string): Effect.Effect<void> =>
          Effect.sync(() => {
            sessions.delete(sessionId)
          }),

        parseFromCookie: (
          cookieHeader: string | null,
        ): Effect.Effect<string | undefined> =>
          Effect.sync(
            () =>
              cookieHeader
                ?.split('; ')
                .find((c) => c.startsWith('session='))
                ?.split('=')[1],
          ),
      }
    },
  },
) {}
