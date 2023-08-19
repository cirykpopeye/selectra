const path = require('path')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = (env, argv) => {
  const config = {
    entry: ['./src/selectra.dist.js', './src/scss/index.scss'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'selectra.min.js'
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['svg-inline-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['eslint-loader']
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
    plugins: [
      new StylelintPlugin({
        files: './src/scss/**/*.scss'
      })
    ]
  }
  if (argv.mode === 'development') {
    config.plugins.push(new WebpackBundleAnalyzer())
  }
  return config
}
