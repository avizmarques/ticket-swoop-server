const { Router } = require("express");
const Ticket = require("./model");
const auth = require("../auth/middleware");
const User = require("../user/model");
const Comment = require("../comment/model");
const Event = require("../event/model");
const riskCalculator = require("./riskCalculator");

const router = new Router();

// MIGHT NOT NEED THIS > USE EVENT ROUTER FOR SINGLE EVENT AND INCLUDE TICKETS
// router.get("/event/:eventId/ticket", async (req, res, next) => {
//   try {
//     const event = await Event.findByPk(req.params.eventId);

//     if (event) {
//       const tickets = await Ticket.findAll({
//         where: { eventId: req.params.eventId },
//         include: [Comment]
//       });

//       if (tickets.length) {
//         const ticketsWithRisk = await Promise.all(
//           tickets.map(async ticket => {
//             let risk = await riskCalculator(ticket);
//             return { dataValues: { ...ticket.dataValues, risk } };
//           })
//         );

//         return res.json(ticketsWithRisk);
//       }

//       return res.status(404).send("No tickets found for this event");
//     }
//     return res.status(404).send("Event not found");
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
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["userName"]
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["userName"]
            }
          ]
        }
      ]
    });

    if (ticket) {
      ticket.dataValues.risk = await riskCalculator(ticket);
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
