/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

module.exports = (envVars) => {
  const { NODE_ENV } = envVars
  console.log(`Webpack running in ${NODE_ENV} enviornment`)
  const envConfig = require(`./webpack.${NODE_ENV}.js`)
  const config = merge(commonConfig, envConfig)
  return config
}
