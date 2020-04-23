const middlewres = {
  cors: require("./cors"),
  jwt: require("./jwtMiddleware"),
  static: require("./static"),
  cookie: require("cookie-parser"),
  body: require("./bodyJsonParser"),
  compression: require("compression"),
  swagger: require("./swagger")
};

module.exports = middlewres;
