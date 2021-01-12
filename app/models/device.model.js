const mongoose = require("mongoose");
const Device = mongoose.model(
  "Device",
  new mongoose.Schema({
    username: String,
    homename: String,
    roomname: String,
    roomip: String,
    devicename: String,
    devicetype: String,
    deviceip: String,
    status: String,
  })
);
module.exports = Device;