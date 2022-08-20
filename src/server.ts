import chalk from 'chalk'
import app from './app'
import { APP_ORIGIN, PORT } from './config/app'
;(async () => {
  try {
    app.listen(PORT, () =>
      // eslint-disable-next-line no-console
      console.log(chalk.blue.bold(`Server running on ${APP_ORIGIN}`))
    )
  } catch (err) {
    console.error(chalk.red.bold(err, 'trigger'))
  }
})()
