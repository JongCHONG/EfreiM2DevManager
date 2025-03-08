const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const isProd = process.env.NODE_ENV === 'production';
const prodUrl = 'https://efrei-about-g1.vercel.app/';

module.exports = {
  entry: "./src/index.js",
  mode: process.env.NODE_ENV || "development",
  output: {
    publicPath: isProd ? prodUrl : 'auto',
    filename: '[name].[contenthash].js'
  },
  devServer: {
    port: 3003,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "about",
      filename: "remoteEntry.js",
      exposes: {
        "./About": "./src/About",
      },
      shared: {
        react: { 
          singleton: true,
          requiredVersion: false,
          eager: true
        },
        "react-dom": { 
          singleton: true,
          requiredVersion: false,
          eager: true
        }
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
}; 