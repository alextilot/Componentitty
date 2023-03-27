const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
var HtmlWebpackInlineSourcePlugin = require("@effortlessmotion/html-webpack-inline-source-plugin");

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
  mode: "production",
  entry: path.resolve(__dirname, "src") + "/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist") + "/app", // put all of the build in a dist folder
    filename: "bundle.js",
    clean: true,
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
        //String replacement for adobe keywords.
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "string-replace-loader",
        options: {
          multiple: [
            {
              search: new RegExp("\\[uid]", "gmi"),
              replace: '["${campaign.id}${campaign.recipe.id}"]',
            },
            {
              search: new RegExp("\\-uid", "gmi"),
              replace: "-${campaign.id}${campaign.recipe.id}",
            },
            // { search: templateLiteralRegex, replace: '$$${false}{' },
          ],
          flags: "ig",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      inlineSource: ".(js)$", // embed all javascript and css inline
      template: "./template/bundle.html",
      filename: "index.html",
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new CopyPlugin({
      patterns: [{ from: "src", to: "ref" }],
    }),
  ],
};
