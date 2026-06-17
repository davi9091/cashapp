import { Effect } from "effect"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authService, useAuthState } from "@/services/Auth"

export function DashboardPage() {
  const authState = useAuthState()
  const navigate = useNavigate()

  const handleLogout = () => {
    Effect.runPromise(
      authService.logout.pipe(
        Effect.andThen(
          Effect.sync(() => navigate("/login", { replace: true })),
        ),
      ),
    )
  }

  if (authState.status !== "authenticated") return null

  return (
    <div className="w-full max-w-2xl">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Dashboard</CardTitle>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Signed in as user #{authState.userId}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
