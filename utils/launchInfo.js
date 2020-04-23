const { info } = require("./log");
const chalk = require("chalk");
const pkg = require("../package.json");

module.exports = function({
  port,
  redis = {},
  sockets = { channels: [] },
  static = "",
  jwt = {
    authlessApi: []
  },
  proxy,
  swagger
}) {
  const { ENV } = process.env;

  // port redis sockets i2o static jwt
  info(`🍜  Noodles launched v${pkg.version}`);

  info("server listen on", chalk.green(port));

  info("ENV:", ENV);

  Object.keys(proxy).forEach(name => {
    info(
      "proxy",
      chalk.green("FROM " + proxy[name].from),
      "TO   " + chalk.green(proxy[name].to)
    );
  });

  Object.keys(redis).forEach((name, index) => {
    info("redis connections", chalk.green(redis[name]));
  });

  sockets.channels.forEach((channel, index) => {
    info("io socket channels", chalk.green(channel));
  });

  if (static) {
    info("hosting static files in", chalk.green(static));
  }

  jwt.authlessApi.forEach(api => {
    info("authless api list", chalk.green(api));
  });

  if (swagger) {
    info("swagger api be hosted at /docs");
  }
};
