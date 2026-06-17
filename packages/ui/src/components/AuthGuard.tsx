import { Effect } from "effect"
import { useEffect } from "react"
import { Navigate, Outlet } from "react-router"
import { authService, useAuthState } from "@/services/Auth"

export function AuthGuard() {
  const authState = useAuthState()

  useEffect(() => {
    Effect.runPromise(authService.checkAuth)
  }, [])

  if (authState.status === "checking") return null
  if (authState.status === "unauthenticated")
    return <Navigate to="/login" replace />

  return <Outlet />
}
