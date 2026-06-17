import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/api"
import {
  validateRegisterForm,
  hasErrors,
  type RegisterFieldErrors,
} from "@/lib/validation"
import { Effect } from "effect"
import { useState } from "react"
import { useNavigate } from "react-router"

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }

export function SignupPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<FormState>({ status: "idle" })
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    const errors = validateRegisterForm(email, password)
    if (hasErrors(errors)) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setState({ status: "loading" })

    Effect.runPromise(
      auth.register(email, password).pipe(
        Effect.match({
          onSuccess: () => {
            navigate("/login")
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

  const isLoading = state.status === "loading"

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
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
              disabled={isLoading}
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && (
              <p className="text-destructive text-xs">{fieldErrors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password && (
              <p className="text-destructive text-xs">{fieldErrors.password}</p>
            )}
          </div>

          {state.status === "error" && (
            <p className="text-destructive text-sm">{state.message}</p>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account…" : "Create account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
