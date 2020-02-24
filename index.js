const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

const userRouter = require("./user/router");
app.use(userRouter);

const eventRouter = require("./event/router");
app.use(eventRouter);

const ticketRouter = require("./ticket/router");
app.use(ticketRouter);

app.listen(port, () => `Listening on port ${port}`);
