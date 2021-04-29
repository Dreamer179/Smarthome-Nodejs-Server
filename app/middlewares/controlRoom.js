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
                homeid:   req.body.homeid,
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
        res.status(404).send({ message: "Failed! home is invalid" });
        return;
        // next();
      });
      return;
    }
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

checkDuplicateRoomIp = (req, res, next) => {
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
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

findRoomName = (req, res, next) => {
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
            _id: req.body.roomid
            }).exec((err, room) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            if (room) {
              next();
              return;
            }
            res.status(404).send({ message: "Failed! room is invalid" });
            next();
          });
          return;
        }
        res.status(404).send({ message: "Failed! home is invalid" });
        next();
      });
      return;
    }
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

const controlRoom = {
  checkDuplicateRoomName,
  checkDuplicateRoomIp,
  findRoomName
};
module.exports = controlRoom;