const fetch = require("node-fetch");
const { info } = require("./log");

class Request {
  constructor(baseURL) {
    const getURL = (url, method, options = {}) => {
      let basement = baseURL + url.substring(1);

      if (method === "GET" && options.query) {
        const query = options.query;

        basement +=
          "?" +
          Object.keys(query)
            .map(key => `${key}=${query[key]}`)
            .join("&");

        delete options.query;
      }

      return basement;
    };

    const makeFetch = (url, method, options = { headers: {} }) => {
      const target = getURL(url, method, options);

      const params = {
        method,
        ...options,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
          host: ""
        }
      };

      info("Make request", target, params);

      return fetch(target, params).then(r => {
        const { status } = r;
        return new Promise((resolve, reject) => {
          r.json()
            .then(data => {
              info("Fetch back", { data });
              resolve({ data, status });
            })
            .catch(() => {
              info("Fetch back with error", { status });
              resolve({ data: {}, status });
            });
        });
      });
    };

    this.get = (url, options) => makeFetch(url, "GET", options);

    this.post = (url, options) => makeFetch(url, "POST", options);

    this.put = (url, options) => makeFetch(url, "PUT", options);

    this.delete = (url, options) => makeFetch(url, "DELETE", options);

    this.head = (url, options) => makeFetch(url, "HEAD", options);

    this.option = (url, options) => makeFetch(url, "OPTION", options);
  }
}

module.exports = function(baseURL) {
  return new Request(baseURL);
};
