const { Router } = require("express");
// const User = require("../user/model");
// const Event = require("../event/model");
const Ticket = require("./model");
const auth = require("../auth/middleware");

const router = new Router();

router.get("/event/:eventId/ticket", async (req, res, next) => {
  try {
    const tickets = await Ticket.findAll({
      where: { eventId: req.params.eventId }
    });
    return res.json(tickets);
  } catch (err) {
    next(err);
  }
});

router.post("/event/:eventId/ticket", auth, async (req, res, next) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      userId: req.user.dataValues.id,
      eventId: req.params.eventId
    });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
