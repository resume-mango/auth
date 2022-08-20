import chalk from 'chalk'
import Redis, { RedisOptions } from 'ioredis'
import { IN_PROD } from './app'

const HOST = !IN_PROD ? 'localhost' : process.env.REDIS_HOST

const REDIS_OPTIONS: RedisOptions = {
  port: Number(process.env.REDIS_PORT),
  host: HOST,
  // password: REDIS_PASSWORD
}

const redisClient = new Redis(REDIS_OPTIONS)

redisClient.on('connect', () =>
  console.log(
    chalk.yellow.bold(
      `Redis connected on ${HOST}:${Number(process.env.REDIS_PORT)}`
    )
  )
)
redisClient.on('error', () =>
  console.log(
    chalk.red.bold(
      `Redis failed to connect on ${HOST}:${Number(process.env.REDIS_PORT)}`
    )
  )
)

export { redisClient }
