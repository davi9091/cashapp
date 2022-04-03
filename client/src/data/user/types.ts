export type IDType = string

export type AuthError = {
  wrongPass: boolean
  error: Error | null
}

export type User = {
  firstName: string
  lastName: string
  username: string
  defaultCurrency: Currency
}

export type UserResponse = {
  firstName: string
  lastName: string
  username: string
  defaultCurrencyId: string
}

export type UserLoginData = {
  username: string
  password: string
}

export type UserRegisterData = {
  username: string
  password: string
  firstName: string
  lastName: string
  defaultCurrencyId?: string
}

export type Currency = {
  id: string
  name: string
  shortName: string
  sign: string
}
