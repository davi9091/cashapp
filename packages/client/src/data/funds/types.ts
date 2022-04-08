import { OPERATION_GROUPS } from './enums'
import { Currency, IDType, User } from '../user/types'

export type Fund = {
  name: string
  id: IDType
  amount: number
  currency: Currency
  owner: User['username']
}

export type FundResponse = {
  name: string
  _id: IDType
  amount: number
  owner: User
  currencyId: string
}

export type AddFund = {
  amount: number
  currency: Currency
  name: string
}

export type OperationGroup = {
  name: string
  defaultLabel: string
}

export type Operation = {
  amount: number
  group: OperationGroup
  label: string
  creationDate: number
  fundId: string
  id: IDType
}

export type AddOperation = {
  amount: number
  groupName: OPERATION_GROUPS
  label: string
  fundId: string
  creationDate: number
}

export type OpsResponse = {
  _id: IDType
  label: string
  amount: number
  fund: FundResponse
  creationDate: number
  groupName: OPERATION_GROUPS
}
