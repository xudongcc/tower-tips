const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: "development",
  entry: {
    background: "./src/background",
    popup: "./src/popup"
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "./dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss: ["vue-style-loader", "css-loader", "sass-loader"]
          }
        }
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "assets/[name].[ext]?[hash]"
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(process.cwd(), "public"),
        to: path.join(process.cwd(), "dist"),
        ignore: [".*"]
      }
    ])
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: [".tsx", ".ts", ".js", ".vue", ".json"]
  },
  devtool: "inline-source-map"
};
