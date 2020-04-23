const expressJWT = require("express-jwt");
const tokenMark = "authorization";
const { secret } = require("../core/jwtSign");

const jwtMiddleware = (authlessApis, servers) => {
  const unlessArr = authlessApis.map(route =>
    servers.map(rootRoute => rootRoute + route)
  );

  const unlessExpression = req => {
    const url = req.originalUrl;
    const rootRoute = url.match(/\/(\w+)/);

    return unlessArr.includes(url) || !rootRoutes.includes(rootRoute);
  };

  return expressJWT({
    secret,
    getToken(req) {
      if (req.headers[tokenMark]) {
        return req.headers[tokenMark];
      }

      return null;
    }
  }).unless(unlessExpression);
};

module.exports = jwtMiddleware;
