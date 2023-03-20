const glob = require('glob');
const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
var HtmlWebpackInlineSourcePlugin = require('@effortlessmotion/html-webpack-inline-source-plugin');

//https://experienceleague.adobe.com/docs/target/using/audiences/visitor-profiles/variables-profiles-parameters-methods.html?lang=en#
//matches all instances of  " uid"
//const regexMatchUID = new RegExp('\\buid\\b', 'gmi');

//matches all instances of "uid" or ${uid} case insensitive.
//const regexMatchUIDTemplate = new RegExp('\\buid\\b|\\[uid]', 'gmi');

//matches all instances of "[uid]"
const bracketUIDRegex = new RegExp('\\[uid]', 'gmi');

const adobeResponseTokens = [
  'campaign',
  'offer',
  'mbox',
  'user',
  'profile',
  'landing',
  'parameter',
];
const doNotFindAdobeResponseToken = adobeResponseTokens.map((element) => {
  return `\\\${${element}`;
});
//Matches all "${" excluding the adobeResponseTokens.
const templateLiteralRegex = new RegExp(
  '(?!' + doNotFindAdobeResponseToken.join('|') + ')(\\${)',
  'gm'
);

// const entryArray = { component_1: './src/component_1/index.js' };
// const components = Object.keys(entryArray);
// console.debug({ entryArray, components });

// const htmlGenerators = components.reduce((entries, componentName) => {
//   console.debug({ entries, componentName });
//   const filename = `./[name]/index.html`;
//   entries.push(
//     new HtmlWebpackPlugin({
//       inject: 'body',
//       template: './templates/bundle.html',
//       filename: filename,
//       inlineSource: '.(js|css)$', // embed all javascript and css inline
//     })
//   );
//   entries.push(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.(js|css)$/]));
//   return entries;
// }, []);
// console.debug(htmlGenerators);
const entryPoints = glob.sync('./src/**/index.js').reduce((acc, path) => {
  /**
   * The "[name]" placeholder in the "output" property will be replaced
   * with each key name in our "entry" object. We need to make sure the
   * keys are a path to the "index.js" file but without the actual file
   * name. This is why we replace the file name, "index.js", with a string
   */
  const entry = path.replace('./src/', '').replace('/index.js', '');
  /**
   * Here we start building our object by placing the "entry" variable from
   * the previous line as a key and the entire path including the file name
   * as the value
   */
  acc[entry] = path;
  return acc;
}, {});
console.debug(entryPoints);
const ASSET_PATH = '/';
module.exports = {
  //entry: { level1: './src/level1/index.js' },
  entry: entryPoints,
  /**
   * The "output" property is what our build files will be named and where the
   * build file will be placed
   */
  output: {
    path: path.resolve(__dirname, 'dist'), // put all of the build in a dist folder
    publicPath: ASSET_PATH,
    filename: '[name]/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        loader: 'url-loader',
        options: { limit: false },
      },
      {
        //String replacement for adobe keywords.
        test: /\.(js|jsx|css)$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            {
              search: bracketUIDRegex,
              replace: '["${campaign.id}${campaign.recipe.id}"]',
            },
            { search: templateLiteralRegex, replace: '$$${false}{' },
          ],
          flags: 'ig',
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    //This makes it possible for us to safely use env vars on our code
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
    new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   inject: 'body',
    //   inlineSource: '.(js)$', // embed all javascript and css inline
    //   template: './template/bundle.html',
    //   filename: '[name]/index.html',
    // }),
    // new HtmlWebpackInlineSourcePlugin(),
  ],
  mode: 'production',
  optimization: {
    usedExports: true,
  },
  // devServer: {
  //   static: path.resolve(__dirname, './dist'),
  //   hot: false,
  // },
};
