import { serve } from 'bun'
import { Effect, Layer, ManagedRuntime } from 'effect'
import { register, login, whoami, logout } from './handlers/user'
import { toHttpResponse } from './lib/response'
import { DatabaseService } from './services/Database'
import { SessionService } from './services/Session'
import { HashService } from './services/Hash'
import type { AppError } from './lib/errors'

type AppServices = DatabaseService | SessionService | HashService

const AppLayer = Layer.mergeAll(
  DatabaseService.Default,
  SessionService.Default,
  HashService.Default,
)

const runtime = ManagedRuntime.make(AppLayer)

const makeHandler =
  (handler: (req: Request) => Effect.Effect<Response, AppError, AppServices>) =>
  (req: Request) =>
    runtime.runPromise(toHttpResponse(handler(req)))

serve({
  port: 3000,
  routes: {
    '/api/auth/register': { POST: makeHandler(register) },
    '/api/auth/login': { POST: makeHandler(login) },
    '/api/auth/logout': { POST: makeHandler(logout) },
    '/api/auth/whoami': { GET: makeHandler(whoami) },
  },
})

console.log('Server running on http://localhost:3000')
