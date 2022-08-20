import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import RoutesV1 from './api/v1/routes'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import connectRedis from 'connect-redis'
import path from 'path'
import { redisClient } from './config/redis'
import { auth, ConfigParams } from 'express-openid-connect'
import { errorHandler, notFound } from './api/v1/middlewares/error_handler'
import { IN_STAGING, IN_PROD, PORT } from './config/app'
import csrf from 'csurf'

const app: Application = express()

const csrfProtection = csrf({
  cookie: {
    key: 'CSRF-TOKEN',
    httpOnly: true,
    secure: IN_PROD || false,
    maxAge: 3600,
    path: '/',
    domain: IN_PROD ? process.env.COOKIE_DOMAIN : 'localhost',
    sameSite: 'lax',
  },
})

const RedisStore = connectRedis(auth) as any

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.disable('x-powered-by')

if (!IN_PROD) {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  )
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
)
if (!IN_STAGING) {
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

  app.use(csrfProtection)
  app.use((req, res, next) => {
    const token = req.csrfToken()
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: true,
      secure: IN_PROD || false,
      maxAge: 3600,
      path: '/',
      domain: IN_PROD ? process.env.COOKIE_DOMAIN : 'localhost',
      sameSite: 'lax',
    })
    res.locals.csrfToken = token
    next()
  })
}

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 60 requests per windowMs
})

app.use(apiRequestLimiter)

const config: ConfigParams = {
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  clientID: process.env.AUTH0_CLIENT_ID,
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL:
    !process.env.AUTH0_BASE_URL && !IN_PROD && !IN_STAGING
      ? `http://localhost:${PORT}`
      : process.env.AUTH0_BASE_URL,
  authRequired: false,
  auth0Logout: true,
  idpLogout: true,

  authorizationParams: {
    response_type: 'code',
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email offline_access',
  },
  routes: {
    login: false,
    logout: false,
    callback: '/auth/callback',
    // postLogoutRedirect: process.env.BASE_HOST,
  },
  session: {
    name: 'SID',
    store: new RedisStore({ client: redisClient }),
    cookie: {
      domain: IN_PROD ? process.env.COOKIE_DOMAIN : 'localhost',
      path: '/',
      transient: false,
      httpOnly: true,
      secure: IN_PROD,
      sameSite: 'Lax',
    },
  },
  afterCallback: async (_req, res, session) => {
    res.cookie('rm_ia', true, {
      expires: new Date(parseInt(session.expires_at) * 1000),
      path: '/',
      domain: IN_PROD ? process.env.COOKIE_DOMAIN : 'localhost',
      sameSite: 'lax',
      secure: IN_PROD,
    })

    return session
  },
}

app.use(auth(config))

app.use('/auth', RoutesV1)

app.use(notFound, errorHandler)

process.on('uncaughtException', function (err) {
  console.error(err)
  console.log('Node NOT Exiting...')
})

export default app
