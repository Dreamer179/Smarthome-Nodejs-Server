const mongoose = require("mongoose");
const Home = mongoose.model(
  "Home",
  new mongoose.Schema({
    username: String,
    homename: String,
    homeimage: Number,
    address: String,
  })
);
module.exports = Home;