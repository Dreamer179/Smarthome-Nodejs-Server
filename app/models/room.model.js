const mongoose = require("mongoose");
const Room = mongoose.model(
  "Room",
  new mongoose.Schema({
    username: String,
    homename: String,
    roomname: String,
    roomimage: Number,
    roomip: String,
    status: Boolean,
  })
);
module.exports = Room;