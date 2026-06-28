import { Effect, Fiber, Stream, SubscriptionRef } from "effect"
import { useEffect, useState } from "react"
import type { Account } from "@/lib/api"
import { Groups, type GroupsState } from "./Groups"
import { Accounts } from "./Accounts"
import { appRuntime } from "./Runtime"

export const useGroups = (): GroupsState => {
  const [state, setState] = useState<GroupsState>(() =>
    appRuntime.runSync(Groups.pipe(Effect.flatMap((s) => SubscriptionRef.get(s.groupsRef)))),
  )

  useEffect(() => {
    const fiber = appRuntime.runFork(
      Groups.pipe(
        Effect.flatMap((s) =>
          s.groupsRef.changes.pipe(Stream.runForEach((gs) => Effect.sync(() => setState(gs)))),
        ),
      ),
    )
    return () => {
      appRuntime.runFork(Fiber.interrupt(fiber))
    }
  }, [])

  return state
}

export const useAccounts = (groupId: number | null): { data: Account[]; loading: boolean } => {
  const [map, setMap] = useState<Map<number, Account[]>>(() =>
    appRuntime.runSync(Accounts.pipe(Effect.flatMap((s) => SubscriptionRef.get(s.accountsRef)))),
  )

  useEffect(() => {
    const fiber = appRuntime.runFork(
      Accounts.pipe(
        Effect.flatMap((s) =>
          s.accountsRef.changes.pipe(Stream.runForEach((m) => Effect.sync(() => setMap(m)))),
        ),
      ),
    )
    return () => {
      appRuntime.runFork(Fiber.interrupt(fiber))
    }
  }, [])

  return {
    data: groupId !== null ? (map.get(groupId) ?? []) : [],
    // absent entry means groups loaded but accounts fetch not yet complete
    loading: groupId !== null && !map.has(groupId),
  }
}
