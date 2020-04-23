const fetch = require("../utils/fetch");
const clients = {};
const routes = {
  get: {},
  post: {},
  put: {},
  delete: {}
};

const addClient = function(app, name, from, to) {
  const getMethod = method => (route, callback) => {
    const routerStack = [routes[method]].concat(route.substring(1).split("/"));

    const latestInfo = routerStack.reduce((routeObj, latter) => {
      const paramRegex = /:\w+/;

      if (paramRegex.test(latter)) {
        latter = "*";
      }

      if (!routeObj[latter]) {
        routeObj[latter] = {};
      }

      routeObj[latter]._key = latter;

      return routeObj[latter];
    });

    latestInfo._callback = callback;
  };

  clients[name] = {
    router: {
      get: getMethod("get"),
      post: getMethod("post"),
      put: getMethod("put"),
      delete: getMethod("delete"),
      use: getMethod("use")
    },
    fetch: fetch(to),
    routes
  };
};

const proxy = {
  get(target, attr) {
    if (clients[attr]) {
      return clients[attr];
    }

    return {};
  }
};

module.exports = new Proxy(addClient, proxy);
