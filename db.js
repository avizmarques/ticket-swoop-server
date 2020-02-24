const Sequelize = require("sequelize");
const dbUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:whatever@localhost:5432/postgres";

const db = new Sequelize(dbUrl);

db.sync({ force: false })
  .then(() => console.log("Database connected"))
  .catch(err => console.error(err));

module.exports = db;
