const path = require('path')

const baseConfig = require('./webpack.base.config')

module.exports = {
  ...baseConfig,
  name: 'webapp',
  entry: {
    'src/webapp': './src/webapp/index.tsx',
  },
  output: {
    path: path.join(__dirname, '.webpack/service'),
    filename: '[name].js'
  },
}
