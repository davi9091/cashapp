import { Effect } from "effect"
import { and, eq } from "drizzle-orm"
import { groupMembers } from "./schema"
import * as Errors from '../lib/errors'
import { DatabaseService } from "../services/Database"

export type GroupMember = typeof groupMembers.$inferInsert

export const addMember = (
  groupId: number,
  userId: number,
  role: GroupMember['role']
): Effect.Effect<
  { id: number },
  Errors.UserAlreadyMemberOfGroup,
  DatabaseService
> => 
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    const rows = yield* Effect.try({
      try: () =>
        db
          .insert(groupMembers)
          .values({ userId, groupId, role })
          .returning({ id: groupMembers.id })
          .all(),
      catch: () => new Errors.UserAlreadyMemberOfGroup(),
    })

    return rows[0] !== undefined
      ? rows[0]
      : yield* Effect.die(new Error('Insert returned no rows'))
  })

export const findMembership = (
  groupId: number,
  userId: number,
): Effect.Effect<GroupMember | undefined, Errors.InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService
    return yield* Effect.try({
      try: () =>
        db
          .select()
          .from(groupMembers)
          .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)))
          .get(),
      catch: (e) => new Errors.InternalServerError({ cause: e }),
    })
  })
