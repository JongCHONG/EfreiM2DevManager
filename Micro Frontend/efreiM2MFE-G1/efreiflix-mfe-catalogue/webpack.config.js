const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const { dependencies } = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:3002/', // Different port from header MFE
  },
  devServer: {
    port: 3002, // Different port from header MFE
    static: {
      directory: path.join(__dirname, 'public'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'catalogue',
      filename: 'remoteEntry.js',
      exposes: {
        './Catalogue': './src/Catalogue',
        './RandomMovie': './src/RandomMovie',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
          eager: true
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
          eager: true
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
}; 