const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

//https://experienceleague.adobe.com/docs/target/using/audiences/visitor-profiles/variables-profiles-parameters-methods.html?lang=en#
const adobeResponseTokens = [
  "campaign",
  "offer",
  "mbox",
  "user",
  "profile",
  "landing",
  "parameter",
];
const doNotFindAdobeResponseToken = adobeResponseTokens.map((element) => {
  return `\\\${${element}`;
});
//Matches all "${" excluding the adobeResponseTokens.
const templateLiteralRegex = new RegExp(
  "(?!" + doNotFindAdobeResponseToken.join("|") + ")(\\${)",
  "gm"
);

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"), // put all of the build in a dist folder
    filename: "bundle.js",
    clean: true,
  },
  devtool: "source-map",
  devServer: {
    static: { directory: path.resolve(__dirname, "dist") },
    port: 8887,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    // host: "webpack-app.dev",
    server: {
      type: "https",
      options: {
        key: "./certificates/webpack-app.dev-key.pem",
        cert: "./certificates/webpack-app.dev.pem",
      },
    },
  },
  optimization: {
    usedExports: true,
  },
  externals: {
    // Use external version of React
    react: "React",
    "react-dom": "ReactDOM",
    "react-router": "ReactRouter",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        //String replacement for keywords.
        test: /\.(js|jsx|css)$/,
        exclude: /node_modules/,
        loader: "string-replace-loader",
        options: {
          multiple: [
            {
              search: new RegExp("\\[uid]", "gmi"),
              replace: '["00000"]',
            },
            {
              search: new RegExp("\\-uid", "gmi"),
              replace: "-00000",
            },
          ],
          flags: "ig",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack App",
      filename: "index.html",
      template: "./template/development.html",
    }),
  ],
};
