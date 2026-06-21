import { Effect } from "effect"
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
