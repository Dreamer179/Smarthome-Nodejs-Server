const mongoose = require("mongoose");
const Device = mongoose.model(
  "Device",
  new mongoose.Schema({
    userid: String,
    homeid: String,
    roomid: String,
    devicename: String,
    deviceip: String,
    devicetype: String,
    status: String,
  })
);
module.exports = Device;