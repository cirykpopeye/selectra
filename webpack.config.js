const path = require('path')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (env, argv) => {
  const config = {
    entry: ['./src/index.js', './src/scss/index.scss'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'selectra.min.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: []
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          type: 'asset/resource',
          generator: {
            filename: 'selectra.min.css'
          },
          use: ['postcss-loader', 'sass-loader']
        }
      ]
    },
    plugins: []
  }
  if (argv.mode === 'development') {
    config.plugins.push(new WebpackBundleAnalyzer())
  }
  return config
}
