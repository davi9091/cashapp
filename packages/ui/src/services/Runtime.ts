import { Effect, Layer, ManagedRuntime } from "effect"
import { Groups, GroupsLive } from "./Groups"
import { Accounts, AccountsLive } from "./Accounts"
import type { Account } from "@/lib/api"

// AccountsLive depends on Groups; same GroupsLive reference → Effect memoizes to one instance
const AppLayer = Layer.mergeAll(GroupsLive, AccountsLive.pipe(Layer.provide(GroupsLive)))

export const appRuntime = ManagedRuntime.make(AppLayer)

appRuntime.runFork(Groups.pipe(Effect.flatMap((s) => s.loadGroups)))

export const createGroup = (name: string) =>
  appRuntime.runPromise(Groups.pipe(Effect.flatMap((s) => s.createGroup(name))))

export const createAccount = (
  groupId: number,
  name: string,
  type: Account["type"],
  currency: string,
) =>
  appRuntime.runPromise(
    Accounts.pipe(Effect.flatMap((s) => s.createAccount(groupId, name, type, currency))),
  )
