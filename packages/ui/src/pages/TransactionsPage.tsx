import { Effect } from "effect"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthState } from "@/services/Auth"
import {
  transactions as transactionsApi,
  groups as groupsApi,
  type Transaction,
  type GroupMember,
} from "@/lib/api"

function formatCents(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Math.abs(cents) / 100)
}

function memberDisplayName(m: GroupMember): string {
  if (m.firstName || m.lastName) return [m.firstName, m.lastName].filter(Boolean).join(" ")
  return m.email
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function TransactionsPage() {
  const authState = useAuthState()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const accountId = Number(params.get("accountId"))
  const groupId = Number(params.get("groupId"))

  const [txList, setTxList] = useState<Transaction[]>([])
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(true)

  // form
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(todayIso())
  const [splitEqually, setSplitEqually] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loadTransactions = () =>
    Effect.runPromise(transactionsApi.list(accountId)).then(
      (data) => { setTxList(data); setLoading(false) },
      () => setLoading(false),
    )

  useEffect(() => {
    if (!accountId || !groupId) return
    Promise.all([
      Effect.runPromise(transactionsApi.list(accountId)),
      Effect.runPromise(groupsApi.listMembers(groupId)),
    ]).then(
      ([txs, mems]) => { setTxList(txs); setMembers(mems); setLoading(false) },
      () => setLoading(false),
    )
  }, [accountId, groupId])

  if (authState.status !== "authenticated") return null

  const amountCents = Math.round(parseFloat(amount) * 100)
  const otherMembers = members.filter((m) => m.userId !== authState.userId)
  const totalPeople = otherMembers.length + 1
  const sharePerPerson = splitEqually && totalPeople > 1
    ? Math.floor(amountCents / totalPeople)
    : 0
  const splits = splitEqually && sharePerPerson > 0
    ? otherMembers.map((m) => ({ userId: m.userId, amountCents: sharePerPerson }))
    : undefined

  const handleSubmit = () => {
    if (!amount || isNaN(amountCents) || amountCents <= 0) {
      setFormError("Enter a valid amount")
      return
    }
    setFormError(null)
    setSubmitting(true)
    Effect.runPromise(
      transactionsApi.create({ type, accountId, amountCents, description: description || undefined, date, splits }),
    ).then(
      () => {
        setAmount("")
        setDescription("")
        setDate(todayIso())
        setSplitEqually(false)
        setSubmitting(false)
        loadTransactions()
      },
      () => {
        setFormError("Failed to create transaction")
        setSubmitting(false)
      },
    )
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          ← Back
        </Button>
        <h1 className="text-lg font-semibold">Transactions</h1>
      </div>

      {/* Create form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Transaction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <div className="flex rounded-md border overflow-hidden">
                <button
                  onClick={() => setType("expense")}
                  className={`px-3 py-2 text-sm transition-colors ${type === "expense" ? "bg-destructive text-destructive-foreground" : "hover:bg-muted/50"}`}
                >
                  Expense
                </button>
                <button
                  onClick={() => setType("income")}
                  className={`px-3 py-2 text-sm transition-colors ${type === "income" ? "bg-green-600 text-white" : "hover:bg-muted/50"}`}
                >
                  Income
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {otherMembers.length > 0 && (
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={splitEqually}
                  onChange={(e) => setSplitEqually(e.target.checked)}
                  className="rounded"
                />
                Split equally between all group members
              </label>
              {splitEqually && sharePerPerson > 0 && (
                <div className="rounded-md bg-muted/50 px-3 py-2 text-xs space-y-0.5">
                  <p className="text-muted-foreground font-medium mb-1">Split preview</p>
                  <p>You: {formatCents(amountCents - sharePerPerson * otherMembers.length)}</p>
                  {otherMembers.map((m) => (
                    <p key={m.userId}>
                      {memberDisplayName(m)}: {formatCents(sharePerPerson)} <span className="text-muted-foreground">(owes you)</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {formError && <p className="text-destructive text-sm">{formError}</p>}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting || !amount}
          >
            {submitting ? "Adding…" : "Add Transaction"}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
          {!loading && txList.length === 0 && (
            <p className="text-muted-foreground text-sm">No transactions yet.</p>
          )}
          {txList.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    tx.type === "income" ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {tx.type === "income" ? "+" : "−"}{formatCents(tx.amountCents)}
                </span>
                <div>
                  <p className="text-sm">{tx.description ?? <span className="text-muted-foreground italic">No description</span>}</p>
                  {tx.categoryName && (
                    <p className="text-muted-foreground text-xs">{tx.categoryIcon} {tx.categoryName}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-xs">{formatDate(tx.date)}</p>
                {tx.splits.length > 0 && (
                  <p className="text-xs text-blue-500">
                    {tx.splits.filter((s) => !s.settledAt).length} split{tx.splits.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}
