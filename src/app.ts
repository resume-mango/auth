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
import os from 'os'
import { emailVerify } from './api/v1/middlewares/emailVerify'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

const app: Application = express()

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
        // Automatically instrument Node.js libraries and frameworks
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.s
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
})

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

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.disable('x-powered-by')

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(
    cors({
        origin: true,
        credentials: true,
    })
)

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
        callback: '/callback',
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

app.use('/', RoutesV1)

app.use('/health-check', (_req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        processtime: process.hrtime(),
        message: 'OK',
        timestamp: Date.now(),
        id: os.hostname(),
    }
    try {
        res.send(healthcheck)
    } catch (error) {
        healthcheck.message = error
        res.status(503).send()
    }
})

app.use(emailVerify, notFound, Sentry.Handlers.errorHandler(), errorHandler)

process.on('uncaughtException', function (err) {
    console.error(err)
    console.log('Node NOT Exiting...')
})

export default app
