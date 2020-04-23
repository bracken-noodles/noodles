// https://gist.github.com/cuppster/2344435
module.exports = () => {
  return function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-role-id, x-member-id, x-accept-token, x-request-id"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    // intercept OPTIONS method
    if ("OPTIONS" == req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  };
};
