const slsw = require('serverless-webpack')

const { DEPLOY_WEBAPP } = process.env

module.exports = {
  mode:
    DEPLOY_WEBAPP ? 'production' :
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
    extensions: ['.tsx', '.ts', '.js']
  }
}
