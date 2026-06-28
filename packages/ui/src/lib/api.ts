import { Data, Effect } from "effect"

export class NetworkError extends Data.TaggedError("NetworkError")<{
  cause: unknown
}> {}
export class ApiError extends Data.TaggedError("ApiError")<{
  status: number
  message: string
}> {}

type ApiFailure = NetworkError | ApiError

const request = (
  path: string,
  options?: RequestInit,
): Effect.Effect<Response, NetworkError> =>
  Effect.tryPromise({
    try: () => fetch(path, options),
    catch: (e) => new NetworkError({ cause: e }),
  })

const parseErrorBody = (res: Response): Effect.Effect<never, ApiFailure> =>
  Effect.tryPromise({
    try: () => res.json() as Promise<{ error?: string }>,
    catch: (e) => new NetworkError({ cause: e }),
  }).pipe(
    Effect.flatMap((body) =>
      Effect.fail(
        new ApiError({
          status: res.status,
          message: body.error ?? "Request failed",
        }),
      ),
    ),
  )

export type Account = {
  id: number
  groupId: number
  name: string
  type: "checking" | "savings" | "credit" | "cash"
  currency: string
  balanceCents: number
  isActive: boolean
}

export type GroupMember = {
  userId: number
  role: "owner" | "member"
  email: string
  firstName: string | null
  lastName: string | null
}

export type TransactionSplit = {
  id: number
  userId: number
  amountCents: number
  settledAt: string | null
}

export type Transaction = {
  id: number
  accountId: number
  amountCents: number
  type: "income" | "expense" | "transfer"
  description: string | null
  date: string
  createdAt: string
  categoryId: number | null
  categoryName: string | null
  categoryIcon: string | null
  categoryColor: string | null
  splits: TransactionSplit[]
}

export type OutstandingSplit = {
  id: number
  amountCents: number
  transactionId: number
  transactionDescription: string | null
  transactionDate: string
  payerUserId: number
  accountName: string
  groupName: string
}

export type Group = {
  id: number
  name: string
  role: "owner" | "member"
  joinedAt: string
}

export const groups = {
  list: (): Effect.Effect<Group[], ApiFailure> => jsonGet("/api/groups"),
  create: (name: string): Effect.Effect<{ groupId: number }, ApiFailure> =>
    jsonPost("/api/groups", { name }),
  listMembers: (groupId: number): Effect.Effect<GroupMember[], ApiFailure> =>
    jsonGet(`/api/groups/members?groupId=${groupId}`),
}

const jsonGet = <T>(path: string): Effect.Effect<T, ApiFailure> =>
  request(path).pipe(
    Effect.flatMap((res) =>
      res.ok
        ? Effect.tryPromise({ try: () => res.json() as Promise<T>, catch: (e) => new NetworkError({ cause: e }) })
        : parseErrorBody(res),
    ),
  )

const jsonPost = <T>(path: string, body: unknown): Effect.Effect<T, ApiFailure> =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).pipe(
    Effect.flatMap((res) =>
      res.ok
        ? Effect.tryPromise({ try: () => res.json() as Promise<T>, catch: (e) => new NetworkError({ cause: e }) })
        : parseErrorBody(res),
    ),
  )

export const accounts = {
  list: (groupId: number): Effect.Effect<Account[], ApiFailure> =>
    jsonGet(`/api/accounts?groupId=${groupId}`),
  create: (
    groupId: number,
    name: string,
    type: Account["type"],
    currency: string,
  ): Effect.Effect<{ accountId: number }, ApiFailure> =>
    jsonPost("/api/accounts", { groupId, name, type, currency }),
}

export const transactions = {
  list: (accountId: number): Effect.Effect<Transaction[], ApiFailure> =>
    jsonGet(`/api/transactions?accountId=${accountId}`),

  create: (
    payload:
      | { type: "income" | "expense"; accountId: number; amountCents: number; description?: string; date: string; splits?: { userId: number; amountCents: number }[] }
      | { type: "transfer"; fromAccountId: number; toAccountId: number; amountCents: number; description?: string; date: string },
  ): Effect.Effect<{ id: number } | { fromId: number; toId: number }, ApiFailure> =>
    jsonPost("/api/transactions", payload),
}

export const splits = {
  outstanding: (): Effect.Effect<OutstandingSplit[], ApiFailure> =>
    jsonGet("/api/splits/outstanding"),

  settle: (splitId: number): Effect.Effect<void, ApiFailure> =>
    request("/api/splits/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ splitId }),
    }).pipe(Effect.flatMap((res) => (res.ok ? Effect.void : parseErrorBody(res)))),
}

export const auth = {
  login: (email: string, password: string): Effect.Effect<void, ApiFailure> =>
    request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).pipe(
      Effect.flatMap((res) => (res.ok ? Effect.void : parseErrorBody(res))),
    ),

  register: (
    email: string,
    password: string,
  ): Effect.Effect<{ userId: number }, ApiFailure> =>
    request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).pipe(
      Effect.flatMap((res) =>
        res.ok
          ? Effect.tryPromise({
              try: () => res.json() as Promise<{ userId: number }>,
              catch: (e) => new NetworkError({ cause: e }),
            })
          : parseErrorBody(res),
      ),
    ),

  logout: (): Effect.Effect<void, ApiFailure> =>
    request("/api/auth/logout", { method: "POST" }).pipe(
      Effect.flatMap((res) => (res.ok ? Effect.void : parseErrorBody(res))),
    ),

  whoami: (): Effect.Effect<{ userId: number }, ApiFailure> =>
    request("/api/auth/whoami").pipe(
      Effect.flatMap((res) =>
        res.ok
          ? Effect.tryPromise({
              try: () => res.json() as Promise<{ userId: number }>,
              catch: (e) => new NetworkError({ cause: e }),
            })
          : parseErrorBody(res),
      ),
    ),
}
