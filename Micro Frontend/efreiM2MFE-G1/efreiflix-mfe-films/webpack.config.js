const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

const isProd = process.env.NODE_ENV === 'production';
const prodUrl = 'https://efrei-films-g1-iota.vercel.app/';

module.exports = {
  entry: "./src/index.js",
  mode: process.env.NODE_ENV || "development",
  output: {
    publicPath: isProd ? prodUrl : 'auto',
    filename: '[name].[contenthash].js'
  },
  devServer: {
    port: 3004,
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
      name: "films",
      filename: "remoteEntry.js",
      exposes: {
        "./Films": "./src/Films",
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