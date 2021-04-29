const mongoose = require("mongoose");
const Home = mongoose.model(
  "Home",
  new mongoose.Schema({
    userid: String,
    homename: String,
    homeip:   String,
    ssid: String,
    wifipassword: String,
    homeimage: String,
    address: String,
    status: Boolean,
  })
);
module.exports = Home;