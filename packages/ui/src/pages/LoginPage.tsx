import { Effect } from "effect"
import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/api"

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }

export function LoginPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<FormState>({ status: "idle" })

  const handleSignupClick = () => {
    navigate("/signup")
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    setState({ status: "loading" })

    Effect.runPromise(
      auth.login(email, password).pipe(
        Effect.match({
          onSuccess: () => {
            navigate("/")
          },
          onFailure: (e) => {
            setState({
              status: "error",
              message:
                e._tag === "ApiError"
                  ? e.message
                  : "Could not reach the server. Please try again.",
            })
          },
        }),
      ),
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={state.status === "loading"}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={state.status === "loading"}
            />
          </div>

          {state.status === "error" && (
            <p className="text-destructive text-sm">{state.message}</p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={state.status === "loading"}
          >
            {state.status === "loading" ? "Signing in…" : "Sign in"}
          </Button>

          <Button
            onClick={handleSignupClick}
            className="w-full"
            disabled={state.status === "loading"}
          >
            Sign up
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
