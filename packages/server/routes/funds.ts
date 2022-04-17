import { NewFundBody } from './types'
import { IUserDoc } from './../models/user'
import { Fund } from './../models/fund'
import HttpStatusCode from 'http-status-codes'
import { Router } from 'express'

export const fundsRouter = Router()

function getAuthUser(req: Express.Request): IUserDoc | false {
  const isAuthenticated = req.isAuthenticated()
  const user = req.user as IUserDoc

  if (user && isAuthenticated) {
    return user
  }

  return false
}

fundsRouter.get('/funds', async (req, res) => {
  const user = getAuthUser(req)

  if (!user) {
    return res.status(HttpStatusCode.UNAUTHORIZED).send()
  }

  try {
    const funds = await Fund.find({ ['owner._id']: user._id })
    if (!funds) {
      res.status(HttpStatusCode.NOT_FOUND)
    }

    res.status(HttpStatusCode.OK).send(funds)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})

fundsRouter.put('/funds/new', async (req, res) => {
  const user = getAuthUser(req)

  if (!user) {
    return res.status(HttpStatusCode.UNAUTHORIZED).send()
  }

  const fundBody: NewFundBody = req.body

  try {
    const newFund = new Fund({
      owner: user,
      ...fundBody,
    })

    const savedFund = await newFund.save()
    return res.status(HttpStatusCode.OK).send(savedFund)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})

fundsRouter.delete('/funds/:id', async (req, res) => {
  const user = getAuthUser(req)

  if (!user) {
    return res.status(HttpStatusCode.UNAUTHORIZED).send()
  }

  const fundId = req.params.id

  if (!fundId) {
    return res.status(HttpStatusCode.BAD_REQUEST).send()
  }

  try {
    await Fund.deleteOne({ _id: fundId })
    return res.status(HttpStatusCode.OK).send()
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})

fundsRouter.post('/funds/edit/:id', async (req, res) => {
  const user = getAuthUser(req)

  if (!user) {
    return res.status(HttpStatusCode.UNAUTHORIZED).send()
  }

  console.log(req.body)

  const fundId = req.params.id

  if (!fundId) {
    return res.status(HttpStatusCode.BAD_REQUEST).send()
  }

  try {
    const fund = await Fund.findById(fundId)

    if (!fund) {
      return res.status(HttpStatusCode.NOT_FOUND).send()
    }
    
    req.body.name && (fund.name = req.body.name)
    req.body.amount && (fund.amount = req.body.amount)

    await fund.save()
    
    return res.status(HttpStatusCode.OK).send(fund)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})
