import { Router } from 'express'
import HttpStatusCode from 'http-status-codes'
import passport from 'passport'

export const userRouter = Router()

userRouter.post(
  '/user/register',
  passport.authenticate('local-signup'),
  (req, res) => {
    const user = req.user
    if (!user)
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ error: 'no such user' })

    //TODO: this is a questionable decision, rewrite later?
    req.login(user, (error) => {
      if (error)
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .send({ error: 'wrong password' })

      return res.status(HttpStatusCode.OK).send(user)
    })
  },
)

userRouter.post('/user/restore', async (req, res) => {
  console.log('user', req.user, req.isAuthenticated())
  const user = req.user
  const isAuthenticated = req.isAuthenticated()

  if (isAuthenticated && user) {
    return res.status(HttpStatusCode.OK).send(user)
  }
  return res.status(HttpStatusCode.UNAUTHORIZED).send()
})

userRouter.post(
  '/user/login',
  passport.authenticate('local-signin'),
  (req, res) => {
    const user = req.user
    if (!user)
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .send({ error: 'no such user' })

    req.login(user, (error) => {
      if (error)
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .send({ error: 'wrong password' })

      return res.status(HttpStatusCode.OK).send(user)
    })
  },
)
