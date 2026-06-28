import { Context, Effect, Layer, Stream, SubscriptionRef } from "effect"
import { accounts as accountsApi, type Account } from "@/lib/api"
import { Groups, type GroupsState } from "./Groups"

interface AccountsService {
  readonly accountsRef: SubscriptionRef.SubscriptionRef<Map<number, Account[]>>
  readonly createAccount: (
    groupId: number,
    name: string,
    type: Account["type"],
    currency: string,
  ) => Effect.Effect<void>
}

export class Accounts extends Context.Tag("Accounts")<Accounts, AccountsService>() {}

export const AccountsLive = Layer.effect(
  Accounts,
  Effect.gen(function* () {
    const groups = yield* Groups
    const accountsRef = yield* SubscriptionRef.make<Map<number, Account[]>>(new Map())

    const loadForGroup = (groupId: number) =>
      accountsApi.list(groupId).pipe(
        Effect.flatMap((data) =>
          SubscriptionRef.update(accountsRef, (map) => new Map([...map, [groupId, data]])),
        ),
        Effect.orElse(() =>
          SubscriptionRef.update(accountsRef, (map) => new Map([...map, [groupId, []]])),
        ),
      )

    yield* groups.groupsRef.changes.pipe(
      Stream.filter((s): s is Extract<GroupsState, { status: "loaded" }> => s.status === "loaded"),
      Stream.map((s) => s.data),
      Stream.mapEffect((groupList) =>
        Effect.forEach(groupList, (g) => loadForGroup(g.id), { concurrency: "unbounded" }),
      ),
      Stream.runDrain,
      Effect.forkDaemon,
    )

    const createAccount = (
      groupId: number,
      name: string,
      type: Account["type"],
      currency: string,
    ) =>
      accountsApi.create(groupId, name, type, currency).pipe(
        Effect.flatMap(() => loadForGroup(groupId)),
        Effect.orElse(() => Effect.void),
      )

    return { accountsRef, createAccount }
  }),
)
