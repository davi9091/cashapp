import { Router } from 'express'
import { getAuthUser } from './utils'
import HttpStatusCode from 'http-status-codes'
import { CustomOpGroup } from '../models/customOpGroup'
import { NewOpGroupBody } from './types'
import { DefaultOpGroup } from '../models/defaultOpGroup'

export const opGroupRouter = Router()

opGroupRouter.get('/opGroups', async (req, res) => {
  const user = getAuthUser(req)

  if (!user) return res.status(HttpStatusCode.UNAUTHORIZED).send()

  try {
    const [customGroups, defaultGroups] = await Promise.all([
      CustomOpGroup.find({ ['owner._id']: user._id }),
      DefaultOpGroup.find({}),
    ])

    const groups = [...defaultGroups, ...customGroups]

    res.status(HttpStatusCode.OK).send(groups)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})

opGroupRouter.get('/opGroups/custom', async(req, res) => {
  const user = getAuthUser(req)

  if (!user) return res.status(HttpStatusCode.UNAUTHORIZED).send()

  try {
    const customGroups = await CustomOpGroup.find({ ['owner._id']: user.id })

    res.status(HttpStatusCode.OK).send(customGroups)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})

opGroupRouter.put('/opGroups/defaultNew', async (req, res) => {
  const user = getAuthUser(req)

  if (!user) return res.status(HttpStatusCode.UNAUTHORIZED).send()

  const groupBody: NewOpGroupBody = req.body

  try {
    const newGroup = new DefaultOpGroup({
      ...groupBody,
    })

    const savedGroup = await newGroup.save()
    return res.status(HttpStatusCode.CREATED).send(savedGroup)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})

opGroupRouter.put('/opGroups/new', async (req, res) => {
  const user = getAuthUser(req)

  if (!user) return res.status(HttpStatusCode.UNAUTHORIZED).send()

  const groupBody: NewOpGroupBody = req.body

  try {
    const newGroup = new CustomOpGroup({
      owner: user,
      ...groupBody,
    })

    const savedGroup = await newGroup.save()
    return res.status(HttpStatusCode.CREATED).send(savedGroup)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})

opGroupRouter.delete('/opGroups/:id', async (req, res) => {
  const user = getAuthUser(req)

  if (!user) return res.status(HttpStatusCode.UNAUTHORIZED).send()

  const groupId = req.params.id

  if (!groupId) return res.status(HttpStatusCode.NOT_FOUND).send()

  try {
    await CustomOpGroup.deleteOne({ _id: groupId, owner: user })
    return res.status(HttpStatusCode.OK).send()
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error)
  }
})
