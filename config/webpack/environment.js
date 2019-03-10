const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

environment.plugins.append(
  'ProvidePlugin:PIXI',
  new webpack.ProvidePlugin({ PIXI: 'lib/pixi' })
)

module.exports = environment
