const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = {
  context: path.resolve(__dirname, '.'),
  entry: {
    autocomplete: './index.js'
  },
  output: {
    path: path.resolve(__dirname, '../../../dist'),
    filename: 'autocomplete.js',
    library: 'AutoComplete',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },      
      {
        test: /\.css$/,
        // use: [MiniCssExtractPlugin.loader,"css-loader"] // Replaces  extract-text-webpack-plugin
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [    
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
