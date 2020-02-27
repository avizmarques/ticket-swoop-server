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
    console.log("only ticket", risk);

    // PRICE DIFERENT FROM AVERAGE ?

    const ticketPrice = ticket.dataValues.price;

    const ticketsToEvent = await Ticket.findAll({
      where: { eventId: ticket.dataValues.eventId }
    });

    const avgTicketPrice =
      ticketsToEvent.reduce((accum, ticket) => {
        return accum + ticket.dataValues.price;
      }, 0) / ticketsToEvent.length;

    const differencePercent = 100 - (ticketPrice * 100) / avgTicketPrice;

    console.log("difference percent", differencePercent);

    if (differencePercent <= 100) {
      risk = risk + differencePercent;
    } else if (differencePercent > 100) {
      const extraPercent = differencePercent - 100;
      if (extraPercent >= 10) {
        risk = risk - 10;
      } else {
        risk = risk - differencePercent;
      }
    }

    console.log("after average price", risk);

    // CREATED DURING BUSINESS HOURS ?
    const ticketCreatedTime = ticket.dataValues.createdAt;
    const hours = ticketCreatedTime.getHours();

    if (hours >= 9 && hours < 17) {
      risk = risk - 10;
    } else {
      risk = risk + 10;
    }

    console.log("business hours", risk);

    // MORE THAN 3 COMMENTS ?
    const numOfComments = ticket.dataValues.comments.length;

    if (numOfComments > 3) {
      risk = risk + 5;
    }

    console.log("num of comments", risk);

    // ADJUST FOR MIN AND MAX AND RETURN
    return risk < 5 ? 5 : risk > 95 ? 95 : Math.trunc(risk);
  } catch (err) {
    console.error(err);
  }
};

module.exports = riskCalculator;
