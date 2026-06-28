import { Context, Effect, Layer, SubscriptionRef } from "effect"
import { groups as groupsApi, type Group, type ApiError, type NetworkError } from "@/lib/api"

export type GroupsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "loaded"; data: Group[] }

interface GroupsService {
  readonly groupsRef: SubscriptionRef.SubscriptionRef<GroupsState>
  readonly loadGroups: Effect.Effect<void>
  readonly createGroup: (name: string) => Effect.Effect<void, ApiError | NetworkError>
}

export class Groups extends Context.Tag("Groups")<Groups, GroupsService>() {}

export const GroupsLive = Layer.effect(
  Groups,
  Effect.gen(function* () {
    const groupsRef = yield* SubscriptionRef.make<GroupsState>({ status: "loading" })

    const loadGroups = groupsApi.list().pipe(
      Effect.map((data): GroupsState => ({ status: "loaded", data })),
      Effect.orElse(() =>
        Effect.succeed<GroupsState>({ status: "error", message: "Failed to load groups" }),
      ),
      Effect.flatMap((state) => SubscriptionRef.set(groupsRef, state)),
    )

    const createGroup = (name: string) =>
      groupsApi.create(name).pipe(Effect.flatMap(() => loadGroups))

    return { groupsRef, loadGroups, createGroup }
  }),
)
