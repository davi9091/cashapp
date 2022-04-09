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

export const RESTORING_USER = 'restoring' as const

export interface IUserService {
  readonly user$: BehaviorSubject<User | typeof RESTORING_USER | null>

  login(loginData: UserLoginData): Promise<AuthError | null>
  logout(): Promise<void>
  register(loginData: UserLoginData): Promise<AuthError | null>
}
export class UserService implements IUserService {
  user$ = new BehaviorSubject<User | typeof RESTORING_USER | null>(RESTORING_USER)

  constructor() {
    this.restoreUser()
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
        throw new Error('401')
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

  async restoreUser() {
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
  return {
    username: resp.username,
    firstName: resp.firstName,
    lastName: resp.lastName,
  }
}
