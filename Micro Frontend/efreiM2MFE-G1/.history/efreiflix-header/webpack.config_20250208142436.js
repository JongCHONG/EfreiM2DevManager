const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3001,
    hot: true,
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
    ],
  },
  plugins: [
    // Configuration Module Federation
    new ModuleFederationPlugin({
      name: "header",
      filename: "remoteEntry.js",
      exposes: {
        // Expose le composant Header
        "./Header": "./src/components/Header",
      },
      shared: {
        // Partage des dépendances
        react: { singleton: true },
        "react-dom": { singleton: true }
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
}; 