const db = require("../models");
const Home = db.home;
const User = db.user;
const Room = db.room;

checkDuplicateRoomName = (req, res, next) => {
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
            Room.findOne({
                homename: req.body.homename,
                roomname: req.body.roomname
                }).exec((err, room) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                if (room) {
                  res.status(400).send({ message: "Failed! roomname is valid" });
                  return;
                }
                next();
              });
          return;
        }
        res.status(404).send({ message: "Failed! homename is invalid" });
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