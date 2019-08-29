/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const slsw = require('serverless-webpack')

const { IS_PRODUCTION } = process.env

module.exports = {
  mode:
    IS_PRODUCTION ? 'production' :
      slsw.lib.webpack.isLocal ? 'development': 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
}
