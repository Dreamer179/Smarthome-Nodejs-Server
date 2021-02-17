const { home } = require("../models");
const db = require("../models");
const Home = db.home;
const User = db.user;
const Room = db.room;

checkDuplicateRoomName = (req, res, next) => {
  User.findOne({
    _id: req.body.userid
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      Home.findOne({
        _id: req.body.homeid
        }).exec((err, home) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (home) {
            Room.findOne({
                roomip: req.body.roomip
                }).exec((err, room) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                if (room) {
                  res.status(400).send({ message: "Failed! roomip is valid" });
                  return;
                }
                next();
              });
          return;
        }
        res.status(404).send({ message: "Failed! home is invalid" });
        return;
        // next();
      });
      return;
    }
    // Tim khong thay username
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

findRoomName = (req, res, next) => {
  // Username
  User.findOne({
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

const controlRoom = {
  checkDuplicateRoomName,
  findRoomName
};
module.exports = controlRoom;