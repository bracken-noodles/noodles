const jwt = require("jsonwebtoken");
const secret = "holyluya";

module.exports = {
  secret,
  sign(obj) {
    return jwt.sign(obj, secret);
  }
};
