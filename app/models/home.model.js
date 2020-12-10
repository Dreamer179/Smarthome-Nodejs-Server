const mongoose = require("mongoose");
const Home = mongoose.model(
  "Home",
  new mongoose.Schema({
    username: String,
    homeid: String,
    address: String,
  })
);
module.exports = Home;