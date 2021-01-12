const db = require("../models");
const Home = db.home;
const User = db.user;

checkDuplicateHomeName = (req, res, next) => {
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
          res.status(400).send({ message: "Failed! homename is valid" });
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

findHomeName = (req, res, next) => {
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

const controlHome = {
  checkDuplicateHomeName,
  findHomeName
};
module.exports = controlHome;