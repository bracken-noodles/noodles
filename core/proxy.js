const hooks = require("./hooks");
const clients = require("./routeClients");
const pathValue = require("../utils/pathValue");
const { info } = require("../utils/log");

const defaultHook = { _callback: (req, res, data) => Promise.resolve(data) };

module.exports = function(name) {
  return (req, res) => {
    const method = req.method.toLowerCase();
    const path = req.path;
    const headers = req.headers;

    const content = { headers };

    info("Request in", method, path, headers);

    if (/post|put|delete/.test(method)) {
      content.body = JSON.stringify(req.body);
    }

    if (method === "get") {
      //encode query only
      for (var param in req.query) {
        if (req.query.hasOwnProperty(param)) {
          req.query[param] = encodeURIComponent(req.query[param]);
        }
      }
      content.query = req.query; // 参数
    }

    headers.host && delete headers.host;

    const callFinished = async function(data = {}) {
      info("Trigger after hook", data, path);

      let result = data;

      const globalHook = hooks[name].after["*"]._callback;
      const thisRouteHook = pathValue(hooks[name].after, path, defaultHook)
        ._callback;

      result = await globalHook(req, res, result);
      result = await thisRouteHook(req, res, result);

      return result;
    };

    const makeCall = function() {
      if (clients[name].routes[method]) {
        const result = pathValue(clients[name].routes[method], path);

        if (result) {
          result._callback && result._callback(req, res);

          callFinished();
          return;
        }
      }

      clients[name].fetch[method](path, content)
        .then(({ data, status }) => {
          info("Response from backend", method, path, data, status);

          res.status(status);

          const result = callFinished(data);

          if (result instanceof Promise) {
            result.then(data => {
              res.send(data);
              res.end();
            });
          } else {
            res.send(result);
            res.end();
          }
        })
        .catch(error => {
          res.send(error);
          res.end();
        });
    };

    if (pathValue(hooks[name].before, path) || hooks[name].before["*"]) {
      info("Trigger before hook", name, path);

      const globalHook = hooks[name].before["*"]._callback;
      const thisRouteHook = pathValue(hooks[name].before, path, defaultHook)
        ._callback;

      globalHook(req, res)
        .then(() => thisRouteHook(req, res))
        .then(makeCall);

      return;
    }

    makeCall();
  };
};
