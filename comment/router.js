const { Router } = require("express");
const Comment = require("./model");
const auth = require("../auth/middleware");

const router = new Router();

router.get("/ticket/:ticketId/comment", async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { ticketId: req.params.ticketId }
    });
    if (!comments.length) {
      return res.status(404).send("No comments found for this ticket");
    }
    return res.json(comments);
  } catch (err) {
    next(err);
  }
});

router.post("/ticket/:ticketId/comment", auth, async (req, res, next) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      userId: req.user.dataValues.id,
      ticketId: req.params.ticketId
    });
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
