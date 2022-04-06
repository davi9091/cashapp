import { NewOperationBody } from './types'
import { Operation } from './../models/operation'
import HttpStatusCode from 'http-status-codes'
import { Router } from 'express'
import { IUserDoc } from '../models/user'
import { Fund } from '../models/fund'

export const opsRouter = Router()

opsRouter.get('/operations/:fundId', async (req, res) => {
  const isAuthenticated = req.isAuthenticated()
  const user = req.user as IUserDoc

  if (!isAuthenticated || !user) {
    return res.status(HttpStatusCode.UNAUTHORIZED)
  }

  const fundId = req.params.fundId

  try {
    const fund = await Fund.findById(fundId)
    if (!fund || fund.owner.id !== user.id)
      throw new Error(`No fund with id ${fundId} that belongs to you was found`)

    const ops = await Operation.find({ ['fund._id']: fundId })
      .sort('-date')
      .limit(10)
      .exec()

    res.status(HttpStatusCode.OK).send(ops)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})

opsRouter.put('/operations', async (req, res) => {
  const isAuthenticated = req.isAuthenticated()
  const user = req.user as IUserDoc

  const reqBody: NewOperationBody = req.body

  if (!isAuthenticated || !user) {
    return res.status(HttpStatusCode.UNAUTHORIZED)
  }

  try {
    const fund = await Fund.findById(reqBody.fundId)
    if (!fund || fund.owner.id !== user.id)
      throw new Error(
        `No fund with id ${reqBody.fundId} that belongs to you was found`,
      )

    const newOperation = new Operation({
      fund: fund,
      ...reqBody,
    })

    const savedOperation = await newOperation.save()

    await fund.update({ amount: fund.amount + reqBody.amount })
    await fund.save()

    return res.status(HttpStatusCode.OK).send(savedOperation)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})
