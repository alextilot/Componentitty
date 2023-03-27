//https://webpack.js.org/guides/environment-variables/
module.exports = (env) => {
  console.log("Production: ", env.production);
  if (env.production === true) {
    return require("./webpack.config.prod.js");
  } else {
    return require("./webpack.config.dev.js");
  }
};
