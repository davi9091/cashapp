import { serve } from 'bun'
import { Effect, Layer, ManagedRuntime } from 'effect'
import { register, login, whoami, logout } from './handlers/user'
import { list as listGroups, create as createGroup, listMembers } from './handlers/group'
import { list as listAccounts, create as createAccount } from './handlers/account'
import { list as listTransactions, create as createTransaction } from './handlers/transaction'
import { outstanding as outstandingSplits, settle as settleplit } from './handlers/split'
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
    '/api/groups': {
      GET: makeHandler(listGroups),
      POST: makeHandler(createGroup),
    },
    '/api/groups/members': { GET: makeHandler(listMembers) },
    '/api/accounts': { GET: makeHandler(listAccounts), POST: makeHandler(createAccount) },
    '/api/transactions': {
      GET: makeHandler(listTransactions),
      POST: makeHandler(createTransaction),
    },
    '/api/splits/outstanding': { GET: makeHandler(outstandingSplits) },
    '/api/splits/settle': { POST: makeHandler(settleplit) },
  },
})

console.log('Server running on http://localhost:3000')
