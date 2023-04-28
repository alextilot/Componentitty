module.exports = (env) => {
  console.log(env.rootDir);
  return {
    mode: "production",
    entry: "/src/index.js",
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
                search: new RegExp("\\[UUID]", "gmi"),
                replace: '["${campaign.id}${campaign.recipe.id}"]',
              },
              {
                search: new RegExp("\\-UUID", "gmi"),
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
    ],
  };
};
