const Ticket = require("./model");

const riskCalculator = async ticket => {
  try {
    let risk = 0;

    // ONLY TICKET OF USER ?
    const userTickets = await Ticket.findAll({
      where: { userId: ticket.dataValues.userId }
    });
    const numberOfTicketsByUser = userTickets.length;

    if (numberOfTicketsByUser < 2) {
      risk = risk + 10;
    }

    // PRICE DIFERENT FROM AVERAGE ?

    const ticketPrice = ticket.dataValues.price;

    const ticketsToEvent = await Ticket.findAll({
      where: { eventId: ticket.dataValues.eventId }
    });

    const avgTicketPrice =
      ticketsToEvent.reduce((accum, ticket) => {
        return accum + ticket.dataValues.price;
      }, 0) / ticketsToEvent.length;

    if (ticketPrice < avgTicketPrice) {
      risk = risk + (avgTicketPrice - ticketPrice);
    } else if (ticketPrice > avgTicketPrice) {
      const differenceInPrice = ticketPrice - avgTicketPrice;
      if (differenceInPrice >= 10) {
        risk = risk - 10;
      } else {
        risk = risk - differenceInPrice;
      }
    }

    // CREATED DURING BUSINESS HOURS ?
    const ticketCreatedTime = ticket.dataValues.createdAt;
    const hours = ticketCreatedTime.getHours();

    if (hours >= 9 && hours < 17) {
      risk = risk - 10;
    } else {
      risk = risk + 10;
    }

    // MORE THAN 3 COMMENTS ?
    const numOfComments = ticket.dataValues.comments.length;

    if (numOfComments > 3) {
      risk = risk + 5;
    }

    // ADJUST FOR MIN AND MAX AND RETURN
    return risk < 5 ? 5 : risk > 95 ? 95 : risk;
  } catch (err) {
    console.error(err);
  }
};

module.exports = riskCalculator;
