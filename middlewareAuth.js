const jwt = require("jsonwebtoken");
const {secret} = require('./config');

module.exports = function(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Login required" });
  try {
    const val = jwt.verify(token, secret);
    req.user = val;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Token Invalid" });
  }
};