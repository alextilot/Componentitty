module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"), // put all of the build in a dist folder
    filename: "bundle.js",
    clean: true,
  },
  devtool: "source-map",
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
    extensions: ["*", ".js", ".jsx"],
  },
  // target: "web",
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
              search: new RegExp("\\[UUID]", "gmi"),
              replace: '["0000"]',
            },
            {
              search: new RegExp("\\-UUID", "gmi"),
              replace: "-0000",
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
