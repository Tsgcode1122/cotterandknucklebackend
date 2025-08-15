const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on("error", () => {
  console.log("MongoDB connection failed");
});
connection.on("connected", () => {
  console.log("MongoDB connection successful");
});

const sessionStore = new MongoDBStore({
  uri: mongoURL,
  collection: "sessions",
});
// Catch errors
sessionStore.on("error", function (error) {
  console.log(error);
});

module.exports = { mongoose, sessionStore };
