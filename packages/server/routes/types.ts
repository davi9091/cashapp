export type NewFundBody = {
  name?: string
  amount: number
  currencyId: string
}

export type NewOperationBody = {
  amount: number
  label: string
  groupName: string
  fundId: string
  creationDate: number
}

export interface INotesBody {
  title: string
  body: string
}

export interface IUser {
  id: number
  token: string
  username: string
  firstName?: string
  lastName?: string
}
