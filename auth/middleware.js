const User = require("../user/model");
const { toData } = require("./jwt");

async function auth(req, res, next) {
  try {
    const auth =
      req.headers.authorization && req.headers.authorization.split(" ");

    if (auth && auth[0] === "Bearer" && auth[1]) {
      const data = toData(auth[1]);
      const user = await User.findByPk(data.id);

      if (user) {
        req.user = user;
        return next();
      }
    }
    return res.status(400).send("You have to login to do this");
  } catch (err) {
    next(err);
  }
}

module.exports = auth;
