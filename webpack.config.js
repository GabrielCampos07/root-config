const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (webpackConfigEnv, argv) => {
  const isProduction = argv.mode === 'production';
  const orgName = "campos-portfolio";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    mode: isProduction ? 'production' : 'development',
    output: {
      path: isProduction
        ? path.resolve(__dirname, "dist/root-config")
        : path.resolve(__dirname, "dist"),
      filename: isProduction
        ? "main.js"
        : "campos-portfolio-root-config.js",
      publicPath: isProduction ? "/root-config/" : "/",
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        filename: "index.html",
        templateParameters: {
          isLocal: !isProduction,
          orgName,
        },
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false,
      }),
    ],
    devServer: !isProduction ? {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    } : undefined,
  });
};
