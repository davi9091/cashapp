import { IUserDoc } from '../models/user'

export function getAuthUser(req: Express.Request): IUserDoc | false {
  const isAuthenticated = req.isAuthenticated()
  const user = req.user as IUserDoc

  if (user && isAuthenticated) {
    return user
  }

  return false
}
