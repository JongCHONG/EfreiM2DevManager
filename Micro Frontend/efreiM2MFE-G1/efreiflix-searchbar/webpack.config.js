/**
 * Configuration Webpack pour le micro-frontend Header
 *
 * Ce fichier configure un micro-frontend qui sera consommé par l'application Shell.
 * Il expose un composant Header qui pourra être importé dynamiquement.
 *
 * Points clés :
 * - Exposition du composant via Module Federation
 * - Configuration du port de développement standalone
 * - Gestion des dépendances partagées avec le Shell
 * - Support du développement indépendant
 */

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const { dependencies } = require("./package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "http://localhost:3003/", // URL publique de base pour les assets (IMPORTANT pour Module Federation)
  },
  devServer: {
    port: 3003, // Port du serveur de développement (IMPORTANT : doit être unique pour chaque MFE)
    static: {
      directory: path.join(__dirname, "public"),
    },
    headers: {
      // Configuration des en-têtes CORS (Cross-Origin Resource Sharing)
      "Access-Control-Allow-Origin": "*", // Autoriser toutes les origines (pour le développement)
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "searchbar", // Nom UNIQUE du Micro Frontend (utilisé par le Shell pour l'importer)
      filename: "remoteEntry.js", // Nom du fichier d'entrée exposé (conventionnel)
      exposes: {
        "./SearchBar": "./src/SearchBar", // Expose le composant Header (chemin relatif)
      },
      shared: {
        // Configuration des dépendances partagées
        react: {
          singleton: true,
          requiredVersion: dependencies.react,
          eager: true, // Ajout de eager pour le chargement
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
          eager: true, // Ajout de eager pour le chargement
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
