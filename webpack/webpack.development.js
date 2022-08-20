/* eslint-disable @typescript-eslint/no-var-requires */

const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    api: './src/server.ts',
  },
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?1000'],
    }),
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Dotenv({
      path: './.env.development',
    }),
  ],
}
