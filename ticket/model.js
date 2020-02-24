const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");
const Event = require("../event/model");

const Ticket = db.define("ticket", {
  imageUrl: Sequelize.STRING,
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

Ticket.belongsTo(User);
Ticket.belongsTo(Event);
User.hasMany(Ticket);
Event.hasMany(Ticket);

module.exports = Ticket;
