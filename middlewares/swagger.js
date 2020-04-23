const swagger = require("swagger-tools");

module.exports = (app, doc) => {
  swagger.initializeMiddleware(doc, middleware => {
    app.use(middleware.swaggerUi());
  });
};
