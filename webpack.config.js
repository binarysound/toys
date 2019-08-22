const fs = require('fs')
const util = require('util')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const slsw = require('serverless-webpack')

const baseConfig = require('./webpack.base.config')
const webappConfig = require('./webpack.webapp.config')

async function walk(dir) {
  const rootFiles = await util.promisify(fs.readdir)(dir)
  const files = await Promise.all(rootFiles.map(async file => {
    const filePath = path.join(dir, file)
    const stats = await util.promisify(fs.stat)(filePath)

    if (stats.isDirectory()) {
      return walk(filePath)
    }
    else if (stats.isFile()) {
      return filePath
    }
  }))

  return files.reduce((all, folderContents) => all.concat(folderContents), [])
}

async function makeEntries(root) {
  const files = await walk(root)
  const extensionRegex = /\.tsx?$/

  return files.reduce((reduction, file) => {
    if (extensionRegex.test(file)) {
      const entryName = file.replace(extensionRegex, '')
      reduction[entryName] = path.resolve(__dirname, file)
    }

    return reduction
  }, {})
}

module.exports = (async () => {
  const serverConfig = {
    ...baseConfig,
    name: 'server',
    entry: await makeEntries('./src/lambda'),
    target: 'node',
    externals: [nodeExternals()],
    output: {
      libraryTarget: 'commonjs',
      path: path.join(__dirname, '.webpack/service'),
      filename: '[name].js'
    },
  }

  return slsw.lib.webpack.isLocal ?
    [webappConfig, serverConfig] :
    serverConfig
})()
