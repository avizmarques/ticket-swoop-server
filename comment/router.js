const { Router } = require("express");
const Comment = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");

const router = new Router();

// DONT THINK I WILL NEED THIS, I CAN GET IT WITH TICKET

// router.get("/ticket/:ticketId/comment", async (req, res, next) => {
//   try {
//     const comments = await Comment.findAll({
//       where: { ticketId: req.params.ticketId }
//     });
//     if (!comments.length) {
//       return res.status(404).send("No comments found for this ticket");
//     }
//     return res.json(comments);
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/ticket/:ticketId/comment", auth, async (req, res, next) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      userId: req.user.dataValues.id,
      ticketId: req.params.ticketId
    });

    res.json({ comment, userName: req.user.dataValues.userName });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
