const { Router } = require("express");
const Ticket = require("./model");
const auth = require("../auth/middleware");

const router = new Router();

// MIGHT NOT NEED THIS > USE EVENT ROUTER FOR SINGLE EVENT AND INCLUDE TICKETS

// router.get("/event/:eventId/ticket", async (req, res, next) => {
//   try {
//     const tickets = await Ticket.findAll({
//       where: { eventId: req.params.eventId }
//     });
//     return res.json(tickets);
//   } catch (err) {
//     next(err);
//   }
// });

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

router.get("/ticket/:id", async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (ticket) {
      return res.json(ticket);
    }
    return res.status(404).send("Ticket not found");
  } catch (err) {
    next(err);
  }
});

router.put("/ticket/:id", auth, async (req, res, next) => {
  try {
    const { imageUrl, price, description } = req.body;
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res
        .status(404)
        .send("The ticket you're trying to change doesn't exist");
    }

    if (ticket.userId === req.user.dataValues.id) {
      const updatedTicket = await Ticket.update(
        { imageUrl, price, description },
        {
          where: { id: req.params.id },
          returning: true
        }
      );
      return res.json(updatedTicket);
    }

    return res
      .status(400)
      .send("You don't have permission to change this ticket");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
