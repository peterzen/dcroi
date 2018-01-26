const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
const DashboardPlugin = require('webpack-dashboard/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

require('dotenv').config();


const ENV = process.env.APP_ENV;
const isTest = ENV === 'test'
const isProd = ENV === 'prod';

function setDevTool() {  // function to set dev-tool depending on environment
  if (isTest) {
    return 'inline-source-map';
  } else if (isProd) {
    return 'source-map';
  } else {
    return 'eval-source-map';
  }
}


const config = {
  entry: __dirname + "/src/app/main.js", // webpack entry point. Module to start building dependency graph
  output: {
    path: __dirname + '/dist', // Folder to store generated bundle
    filename: 'bundle.js',  // Name of generated bundle after build
    publicPath: '/' // public URL of the output directory when referenced in a browser
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ]
  },
  plugins: [
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: __dirname + "/src/app/index.tpl.html",
      inject: 'body'
    })
  ],
  devServer: {  // configuration for webpack-dev-server
    contentBase: './src/public',  //source of static assets
    port: 3000,
  },

  devtool: setDevTool(),  //Set the devtool

};


if(isProd) {  // plugins to use in a production environment
  config.plugins.push(
    new UglifyJSPlugin(),  // minify the chunk
    new CopyWebpackPlugin([{  // copy assets to public folder
      from: __dirname + '/src/public'
    }])
  );
};

module.exports = config;
