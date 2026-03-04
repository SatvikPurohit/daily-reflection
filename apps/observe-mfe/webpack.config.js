const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

const deps = require("./package.json").dependencies;

/** @type {import('webpack').Configuration} */
module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    entry: "./src/index.tsx",
    output: {
      publicPath: isDev
        ? process.env.MFE_PUBLIC_PATH ?? "http://localhost:3001/"
        : "auto",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        "@repo/shared-types": path.resolve(
          __dirname,
          "../../libs/shared/types/src/index.ts"
        ),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "observe_mfe",
        filename: "remoteEntry.js",
        exposes: {
          "./ObserveWidget": "./src/components/ObserveWidget",
          "./PatternsList": "./src/components/PatternsList",
          "./MoodHistory": "./src/components/MoodHistory",
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
          "@tanstack/react-query": {
            singleton: true,
            requiredVersion: deps["@tanstack/react-query"],
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
    devServer: {
      port: 3001,
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    devtool: isDev ? "eval-source-map" : "source-map",
  };
};
