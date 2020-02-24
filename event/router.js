const { Router } = require("express");
const Event = require("./model");
const auth = require("../auth/middleware");
const Ticket = require("../ticket/model");
const User = require("../user/model");

const router = new Router();

router.get("/event", async (req, res, next) => {
  try {
    const events = await Event.findAll();

    if (events.length) {
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

    const event = await Event.create({
      ...req.body,
      userId: req.user.dataValues.id
    });

    return res.json(event);
  } catch (err) {
    next(err);
  }
});

router.get("/event/:id", async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Ticket,
          include: [
            {
              model: User,
              attributes: ["userName"]
            }
          ]
        }
      ]
    });

    if (event) {
      return res.json(event);
    } else {
      return res.status(404).send("Event not found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
