import { Effect, Fiber, Stream, SubscriptionRef } from "effect"
import { useEffect, useState } from "react"
import { auth } from "@/lib/api"

export type AuthState =
  | { status: "checking" }
  | { status: "authenticated"; userId: number }
  | { status: "unauthenticated" }

const makeAuthService = Effect.gen(function* () {
  const stateRef = yield* SubscriptionRef.make<AuthState>({
    status: "checking",
  })

  const checkAuth = auth.whoami().pipe(
    Effect.map(
      ({ userId }): AuthState => ({ status: "authenticated", userId }),
    ),
    Effect.orElse(() =>
      Effect.succeed<AuthState>({ status: "unauthenticated" }),
    ),
    Effect.flatMap((state) => SubscriptionRef.set(stateRef, state)),
  )

  const logout = auth
    .logout()
    .pipe(
      Effect.ignore,
      Effect.andThen(
        SubscriptionRef.set(stateRef, { status: "unauthenticated" }),
      ),
    )

  return { stateRef, checkAuth, logout }
})

export const authService = Effect.runSync(makeAuthService)

export const useAuthState = (): AuthState => {
  const [state, setState] = useState<AuthState>(() =>
    Effect.runSync(SubscriptionRef.get(authService.stateRef)),
  )

  useEffect(() => {
    const fiber = Effect.runFork(
      authService.stateRef.changes.pipe(
        Stream.runForEach((s) => Effect.sync(() => setState(s))),
      ),
    )
    return () => {
      Effect.runFork(Fiber.interrupt(fiber))
    }
  }, [])

  return state
}
