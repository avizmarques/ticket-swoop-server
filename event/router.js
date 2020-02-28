const { Router } = require("express");
const Event = require("./model");
const auth = require("../auth/middleware");
const Ticket = require("../ticket/model");
const User = require("../user/model");
const Comment = require("../comment/model");
const riskCalculator = require("../ticket/riskCalculator");
const { Op } = require("sequelize");

const router = new Router();

router.get("/event", async (req, res, next) => {
  try {
    const offset = (req.query.page - 1) * 9;
    const events = await Event.findAndCountAll({
      where: {
        endDate: {
          [Op.gte]: new Date()
        }
      },
      limit: 9,
      offset,
      order: [["createdAt", "DESC"]]
    });

    if (events.rows.length) {
      return res.json(events);
    }

    return res.status(404).send("No events found");
  } catch (err) {
    next(err);
  }
});

router.post("/event", auth, async (req, res, next) => {
  try {
    const { name, description, imageUrl, startDate, endDate } = req.body;
    if (!name || !description || !imageUrl || !startDate || !endDate) {
      return res
        .status(400)
        .send("Please provide all information needed to create an event.");
    }

    await Event.create({
      ...req.body,
      userId: req.user.dataValues.id
    });

    const offset = (req.query.page - 1) * 9;
    const events = await Event.findAndCountAll({
      where: {
        endDate: {
          [Op.gte]: new Date()
        }
      },
      limit: 9,
      offset,
      order: [["createdAt", "DESC"]]
    });

    if (events.rows.length) {
      return res.json(events);
    }

    return res.status(404).send("No events found");
  } catch (err) {
    next(err);
  }
});

router.get("/event/:id", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (event) {
      const tickets = await Ticket.findAll({
        where: { eventId: req.params.id },
        include: [
          Comment,
          {
            model: User,
            attributes: ["userName"]
          }
        ]
      });

      const ticketsWithRisk =
        tickets.length &&
        (await Promise.all(
          tickets.map(async ticket => {
            let risk = await riskCalculator(ticket);
            return { ...ticket.dataValues, risk };
          })
        ));

      return res.json({ event, tickets: ticketsWithRisk });
    } else {
      return res.status(404).send("Event not found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
