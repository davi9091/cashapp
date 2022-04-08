import { Currency, User } from '../types'
import { getDefaultCurrency } from '../utils/currencies'

type CurrencyMock = () => Currency
export const currencyMock: CurrencyMock = getDefaultCurrency

type UserMock = (id: string) => User
export const userMock: UserMock = (username: string) => ({
  username,
  firstName: 'Mock',
  lastName: 'Testerov',
  defaultCurrency: currencyMock(),
})

