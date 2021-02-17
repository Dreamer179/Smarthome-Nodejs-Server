const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const controlHome = require("./controlHome");
const controlRoom = require("./controlRoom");
const controlDevice = require("./controlDevice");
module.exports = {
  authJwt,
  verifySignUp,
  controlHome,
  controlRoom,
  controlDevice
};