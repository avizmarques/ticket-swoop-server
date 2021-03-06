const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");
const { toJWT } = require("../auth/jwt");

const router = new Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    if (userName && email && password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await User.create({ ...req.body, password: hashedPassword });
      return res.status(201).send("User created successfully");
    }

    return res
      .status(400)
      .send("Please provide all information needed to create an account");
  } catch (err) {
    // if (err.name === "SequelizeUniqueConstraintError") {
    //   return res.status(400).send("This email address already has an account.");
    // }
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ where: { userName: userName } });

    if (user) {
      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (passwordIsValid) {
        const token = toJWT({ id: user.id });
        return res.status(200).json({
          userName: user.dataValues.userName,
          token: token,
          id: user.dataValues.id
        });
      }
    }

    return res.status(400).send("Please provide a valid email and password");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
