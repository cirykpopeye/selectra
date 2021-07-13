const path = require('path')

module.exports = {
  entry: ['./src/index.js', './src/scss/index.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'selectize.js.min.js'
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
          filename: 'selectize.js.min.css'
        },
        use: ['sass-loader']
      }
    ]
  }
}
