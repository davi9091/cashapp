import { Effect } from "effect"
import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authService, useAuthState } from "@/services/Auth"
import { createGroup, createAccount } from "@/services/Runtime"
import { useGroups, useAccounts } from "@/services/hooks"
import type { Account } from "@/lib/api"

export function DashboardPage() {
  const authState = useAuthState()
  const navigate = useNavigate()
  const groupsState = useGroups()
  const [newGroupName, setNewGroupName] = useState("")
  const [creating, setCreating] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const { data: accounts, loading: accountsLoading } = useAccounts(selectedGroupId)
  const [newAccountName, setNewAccountName] = useState("")
  const [newAccountType, setNewAccountType] = useState<Account["type"]>("cash")
  const [newAccountCurrency, setNewAccountCurrency] = useState("EUR")
  const [creatingAccount, setCreatingAccount] = useState(false)

  console.log(accounts, groupsState)

  const handleGroupClick = (groupId: number) => {
    setSelectedGroupId((prev) => (prev === groupId ? null : groupId))
    setNewAccountName("")
  }

  const handleCreateAccount = (groupId: number) => {
    const name = newAccountName.trim()
    if (!name) return
    setCreatingAccount(true)
    createAccount(groupId, name, newAccountType, newAccountCurrency).then(
      () => { setNewAccountName(""); setCreatingAccount(false) },
      () => setCreatingAccount(false),
    )
  }

  const handleCreate = () => {
    const name = newGroupName.trim()
    if (!name) return
    setCreating(true)
    createGroup(name).then(
      () => { setNewGroupName(""); setCreating(false) },
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
              <div key={group.id}>
                <button
                  onClick={() => handleGroupClick(group.id)}
                  className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="text-sm font-medium">{group.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs capitalize">{group.role}</span>
                    <span className="text-muted-foreground text-xs">
                      {selectedGroupId === group.id ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                {selectedGroupId === group.id && (
                  <div className="mt-1 ml-3 space-y-1 border-l pl-3">
                    {accountsLoading && (
                      <p className="text-muted-foreground py-1 text-xs">Loading accounts…</p>
                    )}
                    {!accountsLoading && accounts.length === 0 && (
                      <p className="text-muted-foreground py-1 text-xs">No accounts in this group.</p>
                    )}
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() =>
                          navigate(`/transactions?accountId=${account.id}&groupId=${group.id}`)
                        }
                        className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition-colors hover:bg-muted/50"
                      >
                        <span className="text-sm">{account.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatCents(account.balanceCents, account.currency)}
                        </span>
                      </button>
                    ))}
                    <div className="flex gap-1.5 pt-1">
                      <Input
                        placeholder="Account name"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateAccount(group.id)}
                        disabled={creatingAccount}
                        className="h-7 text-xs"
                      />
                      <select
                        value={newAccountType}
                        onChange={(e) => setNewAccountType(e.target.value as Account["type"])}
                        disabled={creatingAccount}
                        className="border-input bg-background h-7 rounded-md border px-1.5 text-xs"
                      >
                        <option value="cash">Cash</option>
                        <option value="checking">Checking</option>
                        <option value="savings">Savings</option>
                        <option value="credit">Credit</option>
                      </select>
                      <Input
                        placeholder="EUR"
                        value={newAccountCurrency}
                        onChange={(e) => setNewAccountCurrency(e.target.value.toUpperCase())}
                        disabled={creatingAccount}
                        className="h-7 w-16 text-xs"
                        maxLength={3}
                      />
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleCreateAccount(group.id)}
                        disabled={creatingAccount || !newAccountName.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
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

function formatCents(cents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}
