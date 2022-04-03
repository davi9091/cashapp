import { getOperationGroups } from './enums'
import { currencyMock } from '../user/mocks/mocks'
import { IDType } from '../user/types'
import { AddFund, AddOperation, Fund, Operation } from './types'

type FundsMock = (userId: string) => Record<string, Fund>
export const fundsMock: FundsMock = (userId) => ({
  '0': {
    name: 'defaultAccount',
    id: '0',
    amount: 1500,
    currency: currencyMock(),
    operations: [],
    owner: userId,
  },
})

type CreateFundsMock = (newFund: AddFund, userId: IDType) => Fund
export const createFundsMock: CreateFundsMock = (newFund, userId) => {
  const id = String(Date.now())

  return {
    id,
    owner: userId,
    operations: [],
    ...newFund,
  }
}

type CreateOperationMock = (newOp: AddOperation, userId: IDType) => Operation
export const createOperationMock: CreateOperationMock = (newOp, userId) => {
  const id = String(Date.now())

  return {
    id,
    group: getOperationGroups()[newOp.groupName],
    owner: userId,
    ...newOp,
  }
}
