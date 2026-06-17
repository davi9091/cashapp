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
