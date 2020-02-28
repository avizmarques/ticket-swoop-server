const { Router } = require("express");
const Comment = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");

const router = new Router();

router.post("/ticket/:ticketId/comment", auth, async (req, res, next) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      userId: req.user.dataValues.id,
      ticketId: req.params.ticketId
    });

    if (comment) {
      return res.json({ comment, userName: req.user.dataValues.userName });
    }

    return res.status(400).send("Error creating the comment");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
