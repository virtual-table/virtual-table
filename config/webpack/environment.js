const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

environment.plugins.append(
  'ProvidePlugin:PIXI',
  new webpack.ProvidePlugin({ PIXI: 'lib/pixi' })
)

environment.plugins.append(
  'ProvidePlugin:THREE',
  new webpack.ProvidePlugin({ THREE: 'three' })
)

environment.plugins.append(
  'ProvidePlugin:CANNON',
  new webpack.ProvidePlugin({ CANNON: 'cannon' })
)

module.exports = environment
