import { BehaviorSubject } from 'rxjs'
import { getHeaders } from '../utils'
import { AuthError, User, UserLoginData, UserRegisterData, UserResponse } from './types'
import { getAllCurrencies, getDefaultCurrency } from './utils/currencies'

const USER_ENDPOINTS = {
  login: '/user/login',
  register: '/user/register',
  restore: '/user/restore',
}

const USER_STORAGE = {
  data: 'USER_DATA',
}

export interface IUserService {
  readonly user$: BehaviorSubject<User | null>

  login(loginData: UserLoginData): Promise<AuthError | null>
  logout(): Promise<void>
  register(loginData: UserLoginData): Promise<AuthError | null>
}
export class UserService implements IUserService {
  user$ = new BehaviorSubject<User | null>(this.restoreUser())

  constructor() {
    this.startPreservingUser()
  }

  async logout(): Promise<void> {
    return this.user$.next(null)
  }

  async login(loginData: UserLoginData): Promise<AuthError | null> {
    try {
      const userResponse = await fetch(
        USER_ENDPOINTS.login,
        getHeaders(loginData),
      )

      if (userResponse.status === 401) {
        throw 401
      }
      const user: UserResponse = await userResponse.json()

      this.user$.next(userResponseToModel(user))
      return null
    } catch (err) {
      if (err === 401) {
        throw { wrongPass: true, error: null }
      }
      throw { wrongPass: false, error: err as Error }
    }
  }

  restoreUser(): User | null {
    const user = localStorage.getItem(USER_STORAGE.data)

    if (!user) return null

    this.sendRestoreReq()
    return JSON.parse(user)
  }

  async sendRestoreReq() {
    const restoreResponse = await fetch(USER_ENDPOINTS.restore, getHeaders())

    if (restoreResponse.status === 401) {
      this.user$.next(null)
      return
    }

    const user: UserResponse = await restoreResponse.json()

    if (user) {
      this.user$.next(userResponseToModel(user))
    }
  }

  startPreservingUser() {
    this.user$.subscribe((user) => {
      if (!user) {
        localStorage.removeItem(USER_STORAGE.data)
        return
      }

      localStorage.setItem(USER_STORAGE.data, JSON.stringify(user))
    })
  }

  async register(registerData: UserRegisterData): Promise<AuthError | null> {
    try {
      const userResponse = await fetch(
        USER_ENDPOINTS.register,
        getHeaders(registerData),
      )

      const user: UserResponse = await userResponse.json()

      this.user$.next(userResponseToModel(user))
      return null
    } catch (err) {
      throw { wrongPass: false, error: err as Error }
    }
  }
}

function userResponseToModel(resp: UserResponse): User {
  const currencies = getAllCurrencies()

  const defaultCurrency = getDefaultCurrency()
  const userCurrency = currencies.find(
    (cur) => resp.defaultCurrencyId === cur.id,
  )

  if (!userCurrency) {
    console.error('No default currency was found for user, setting default')
  }

  return {
    ...resp,
    defaultCurrency: userCurrency || defaultCurrency,
  }
}
