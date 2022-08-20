/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: [
          path.resolve(__dirname, './data/'),
          path.resolve(__dirname, './seeder.ts'),
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '..', 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  node: {
    __filename: false,
    __dirname: false,
  },
}
