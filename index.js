const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const redis = require("@decobim/noodles-redis");
const sockets = require("@decobim/noodles-sockets");
const launchInfo = require("./utils/launchInfo");
const handleProxy = require("./core/proxy");
const clients = require("./core/routeClients");
const hooks = require("./core/hooks");
const { sign } = require("./core/jwtSign");
const jsyaml = require("js-yaml");
const fs = require("fs");
const { info, error } = require("./utils/log");

const {
  cors,
  jwt,
  static,
  cookie,
  body,
  compression,
  swagger
} = require("./middlewares");

[cors, cookie, body, compression].forEach(mid => app.use(mid()));

function init(conf) {
  if (conf.jwt) {
    if (conf.jwt.authlessApis) {
      jwt(app, conf.jwt.authlessApis, conf.proxy.map(mapping => mapping.from));
    }
  }

  if (conf.swagger && process.env.ENV) {
    try {
      let doc;
      if (typeof conf.swagger !== "string") {
        doc = conf.swagger;
      }

      doc = jsyaml.safeLoad(fs.readFileSync(conf.swagger, "utf8"));
      swagger(app, doc);
    } catch (err) {
      info("There may be an issue with swagger file or swagger itself");
      error(err);
    }
  }

  if (conf.static) app.use(static(conf.static));

  if (conf.redis) redis(conf.redis);

  if (conf.sockets) {
    if (conf.sockets.channels) {
      sockets(conf.sockets.channels, io);
    }
  }

  Object.keys(conf.proxy).forEach(name => {
    const { from, to, hooks: { before, after } = {} } = conf.proxy[name];

    clients(app, name, from, to);

    if (before) {
      Object.keys(before).forEach(function(route) {
        hooks[name].before[route] = before[route];
      });
    }

    if (after) {
      Object.keys(after).forEach(function(route) {
        hooks[name].after[route] = after[route];
      });
    }

    app.use(from, handleProxy(name));
  });

  conf.port = conf.port || 10089;
  server.listen(conf.port);

  launchInfo(conf);

  return app;
}

init.clients = clients;
init.jwtSign = sign;

module.exports = init;
