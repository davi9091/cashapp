import { opsRouter } from './routes/operations'
import { fundsRouter } from './routes/funds'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import mongoose from 'mongoose'
import { json } from 'body-parser'
import { DatabaseSingleton } from './helpers/DatabaseSingleton'
import { userRouter } from './routes/user'
import passport from 'passport'
import session from 'express-session'
import { initPassportUserStrategy } from './passport-strategies/user'
import path from 'path'
import dotenv from 'dotenv'
import {opGroupRouter} from './routes/opGroups'

const isDevEnv = process.env.DEV_ENV === 'true'
const app = express()
const PORT = process.env.PORT || 3200
const appRoot = isDevEnv ? path.join(__dirname, 'client', 'build') :path.join(__dirname, 'client')

if (!process.env.DB_URL) {
  dotenv.config()
}

const DB_URL = process.env.DB_URL

if (!DB_URL) {
  throw new Error('DB_URL env variable is not set')
}

app.use(cors())
app.use(express.static(appRoot))
app.use(cookieParser())
app.use(json())
app.use(
  session({
    secret: 'very secret',
    resave: true,
    saveUninitialized: true,
  }),
)
app.use(passport.initialize())
app.use(passport.session())

mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then((mongooseInstance) => {
    DatabaseSingleton.setInstance(mongooseInstance)
    initPassportUserStrategy(passport)

    passport.initialize()
    app.use(userRouter)
    app.use(fundsRouter)
    app.use(opsRouter)
    app.use(opGroupRouter)

    app.use('/', (_req, res) => {
      res.sendFile(path.join(appRoot, 'index.html'))
    })

    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error(error)
  })

// DatabaseSingleton.setClient(database, 'notes');
