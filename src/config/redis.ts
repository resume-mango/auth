import chalk from "chalk"
import Redis from "ioredis"

const URL = process.env.REDIS_URL

const redisClient = new Redis(URL)

redisClient.on("connect", () =>
  console.log(chalk.yellow.bold(`Redis connected on ${URL}`))
)
redisClient.on("error", () =>
  console.log(chalk.red.bold(`Redis failed to connect on ${URL}`))
)

export { redisClient }
