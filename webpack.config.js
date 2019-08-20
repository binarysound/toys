const path = require('path')
const nodeExternals = require('webpack-node-externals')
const slsw = require('serverless-webpack')

const baseConfig = require('./webpack.base.config')
const webappConfig = require('./webpack.webapp.config')

const serverConfig = {
  ...baseConfig,
  name: 'server',
  entry: {
    'src/index': './src/index.ts',
  },
  target: 'node',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack/service'),
    filename: '[name].js'
  },
}

module.exports = slsw.lib.webpack.isLocal ?
  [webappConfig, serverConfig] :
  serverConfig
