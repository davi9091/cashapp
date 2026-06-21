import { Schema } from 'effect'

export const AddMemberSchema = Schema.Struct({
  groupId: Schema.Number,
  userId: Schema.Number,
  role: Schema.Enums({ owner: 'owner', member: 'member' }),
})
