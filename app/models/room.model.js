const mongoose = require("mongoose");
const Room = mongoose.model(
  "Room",
  new mongoose.Schema({
    userid: String,
    homeid: String,
    roomname: String,
    roomip: String,
    roomimage: Number,
    status: Boolean,
  })
);
module.exports = Room;