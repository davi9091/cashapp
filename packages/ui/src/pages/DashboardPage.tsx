import { Effect } from "effect"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authService, useAuthState } from "@/services/Auth"
import { groups as groupsApi, type Group } from "@/lib/api"

type GroupsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; data: Group[] }

export function DashboardPage() {
  const authState = useAuthState()
  const navigate = useNavigate()
  const [groupsState, setGroupsState] = useState<GroupsState>({ status: "loading" })
  const [newGroupName, setNewGroupName] = useState("")
  const [creating, setCreating] = useState(false)

  const loadGroups = () => {
    Effect.runPromise(groupsApi.list()).then(
      (data) => setGroupsState({ status: "loaded", data }),
      () => setGroupsState({ status: "error", message: "Failed to load groups" }),
    )
  }

  useEffect(() => {
    loadGroups()
  }, [])

  const handleCreate = () => {
    const name = newGroupName.trim()
    if (!name) return
    setCreating(true)
    Effect.runPromise(groupsApi.create(name)).then(
      () => {
        setNewGroupName("")
        setCreating(false)
        loadGroups()
      },
      () => setCreating(false),
    )
  }

  const handleLogout = () => {
    Effect.runPromise(
      authService.logout.pipe(
        Effect.andThen(Effect.sync(() => navigate("/login", { replace: true }))),
      ),
    )
  }

  if (authState.status !== "authenticated") return null

  return (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Dashboard</CardTitle>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Groups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {groupsState.status === "loading" && (
            <p className="text-muted-foreground text-sm">Loading…</p>
          )}
          {groupsState.status === "error" && (
            <p className="text-destructive text-sm">{groupsState.message}</p>
          )}
          {groupsState.status === "loaded" && groupsState.data.length === 0 && (
            <p className="text-muted-foreground text-sm">
              You don't have any groups yet. Create one below.
            </p>
          )}
          {groupsState.status === "loaded" &&
            groupsState.data.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <span className="text-sm font-medium">{group.name}</span>
                <span className="text-muted-foreground text-xs capitalize">{group.role}</span>
              </div>
            ))}

          <div className="flex gap-2 pt-2">
            <Input
              placeholder="New group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              disabled={creating}
            />
            <Button onClick={handleCreate} disabled={creating || !newGroupName.trim()}>
              {creating ? "Creating…" : "Create"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
