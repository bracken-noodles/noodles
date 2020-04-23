/* 
hooks

if( hooks.proxyName.before[path] ){
  hooks.proxyName.before[path](req,res)
}

*/

const getHookProxy = () =>
  new Proxy(
    {},
    {
      get(target, attr) {
        return (
          target[attr] || {
            _callback: (req, res, data) => Promise.resolve(data)
          }
        );
      },
      set(target, attr, value) {
        if (attr === "*") attr = "/*";

        const routeStack = [target].concat(attr.substring(1).split("/"));

        const latestInfo = routeStack.reduce((routeObj, latter) => {
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

        latestInfo._callback = value;
      }
    }
  );

module.exports = new Proxy(
  {},
  {
    get(target, attribute) {
      if (!target[attribute]) {
        target[attribute] = {
          before: getHookProxy(),
          after: getHookProxy()
        };
      }

      return target[attribute];
    },
    set(target, attr, value) {
      target[attr] = value;
    }
  }
);
