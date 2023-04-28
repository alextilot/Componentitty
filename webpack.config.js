const path = require("path");

var HtmlWebpackInlineSourcePlugin = require("@effortlessmotion/html-webpack-inline-source-plugin");
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

//https://webpack.js.org/guides/environment-variables/
module.exports = (env) => {
  console.log("Mode:", env.production);
  console.log("Source:", env.callingPath);
  const callingPath = env.callingPath;
  const mode = env.production ? "production" : "development";
  const replacementUUID = env.production ? "${campaign.id}${campaign.recipe.id}" : "0000";
  const devtool = env.production ? false : "source-map";

  console.log("PATH:", path.resolve(callingPath, "src/index.ts"));
  return {
    mode: mode,
    entry: path.resolve(callingPath, "src/index.ts"),
    output: {
      path: path.resolve(callingPath, "dist"),
      filename: "bundle.js",
      clean: true,
    },
    devtool: devtool,
    devServer: {
      static: { directory: path.resolve(__dirname, "dist") },
      port: 8887,
      host: "127.0.0.1",
      open: false,
      hot: true,
      compress: true,
      historyApiFallback: true,
      allowedHosts: [".landsend.com", "landsend.com"],
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      },
      server: {
        type: "http",
        options: {
          key: "./certificates/cert.key",
          cert: "./certificates/cert.crt",
          ca: "./certificates/ca.pem",
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
      extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
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
                search: new RegExp("\\[UUID]", "gmi"),
                replace: `["${replacementUUID}"]`,
              },
              {
                search: new RegExp("\\-UUID", "gmi"),
                replace: `-${replacementUUID}`,
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
    ],
  };
};
