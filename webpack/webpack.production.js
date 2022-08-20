/* eslint-disable @typescript-eslint/no-var-requires */

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: [path.resolve(__dirname, '..', 'src/server.ts')],
  externals: [nodeExternals({})],
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      console.info(
        `\u001b[A\u001b[K\u001b[33m${(percentage * 100).toFixed(2)}%` +
          `\t\u001b[0m\u001b[1m${message}\t` +
          `\u001b[0m\u001b[90m${
            args && args.length > 0 ? args[0] : ''
          }\u001b[0m`
      )
    }),
    new Dotenv({
      path: './.env.production',
    }),
  ],
}
