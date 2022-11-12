import { User, UserResponse } from '../user/types'

type ServerCustomOpGroup = {
  owner: User
  isDefault: false
  name: string
  emoji: string
  isIncome: boolean
}

type DefaultOpGroup = {
  isDefault: true
  name: string
  emoji: string
  isIncome: boolean
}

export type CustomOpGroup = Omit<ServerCustomOpGroup, 'owner'>
export type GroupResponse = ServerCustomOpGroup | DefaultOpGroup
export type OperationGroup = CustomOpGroup | DefaultOpGroup
