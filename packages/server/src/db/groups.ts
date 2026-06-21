import { InternalServerError } from './../lib/errors'
import { Effect } from 'effect'
import { eq } from 'drizzle-orm'
import { DatabaseService } from '../services/Database'
import { groups, groupMembers } from './schema'

export type Group = typeof groups.$inferSelect

export const createGroup = (
  name: string,
): Effect.Effect<{ id: number }, InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService

    const rows = yield* Effect.try({
      try: () =>
        db.insert(groups).values({ name }).returning({ id: groups.id }).all(),
      catch: (error) => new InternalServerError({ cause: error }),
    })

    return rows[0] !== undefined
      ? rows[0]
      : yield* Effect.die(new Error('Insert returned no rows'))
  })

export type UserGroup = {
  id: number
  name: string
  role: 'owner' | 'member'
  joinedAt: Date
}

export const listGroupsForUser = (
  userId: number,
): Effect.Effect<UserGroup[], InternalServerError, DatabaseService> =>
  Effect.gen(function* () {
    const { db } = yield* DatabaseService

    return yield* Effect.try({
      try: () =>
        db
          .select({
            id: groups.id,
            name: groups.name,
            role: groupMembers.role,
            joinedAt: groupMembers.joinedAt,
          })
          .from(groupMembers)
          .innerJoin(groups, eq(groupMembers.groupId, groups.id))
          .where(eq(groupMembers.userId, userId))
          .all() as UserGroup[],
      catch: (error) => new InternalServerError({ cause: error }),
    })
  })
