const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
   entry:  {
      main: path.join(__dirname, 'src', 'main.js')
   },
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index_bundle.js'
   },
   devServer: {
      inline: true,
      port: 8080
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react']
            }
         },
         {
            test: /\.worker\.js$/,
            use: { loader: 'worker-loader'}
         }
      ]
   },
   plugins:[
      /*
      new HtmlWebpackPlugin({
         template: './index.html'
      }),*/
      new BundleAnalyzerPlugin({analyzerMode: 'static'})
   ]
   
}