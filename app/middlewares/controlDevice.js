const db = require("../models");
const Home = db.home;
const User = db.user;
const Room = db.room;
const Device = db.device;

checkDuplicateDevice = (req, res, next) => {
  Home.findOne({
    _id: req.body.homeid
  }).exec((err, home) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (home) {
      Room.findOne({
        _id: req.body.roomid
        }).exec((err, room) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (room) {
            Device.findOne({
                devicename: req.body.devicename
                }).exec((err, device) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                if (device) {
                  res.status(400).send({ message: "Failed! devicename is valid" });
                  return;
                }
                next();
              });
          return;
        }
        res.status(404).send({ message: "Failed! room is invalid" });
        return;
        // next();
      });
      return;
    }
    // Tim khong thay username
    res.status(404).send({ message: "Failed! home is invalid" });
    return;
  });
};

findDeviceName = (req, res, next) => {
  // Username
  Device.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      Home.findOne({
        homename: req.body.homename
        }).exec((err, home) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (home) {
          next();
          return;
        }
        next();
      });
      return;
    }
    // Tim khong thay username
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

const controlDevice = {
  checkDuplicateDevice,
  findDeviceName
};
module.exports = controlDevice;