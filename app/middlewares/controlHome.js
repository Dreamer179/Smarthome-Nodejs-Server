const db = require("../models");
const Home = db.home;
const User = db.user;

checkDuplicateHomeName = (req, res, next) => {
  User.findOne({
    _id: req.body.userid
  }).exec((err, user) => {
    console.log(req.body.userid)
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      Home.findOne({
        userid: user.id,
        homename: req.body.homename
        }).exec((err, home) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (home) {
          res.status(400).send({
            message: "Failed!",
            status: "homename is valid"
            });
          return;
        }
        next();
      });
      return;
    }
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

checkDuplicateHomeIp = (req, res, next) => {
  User.findOne({
    _id: req.body.userid
  }).exec((err, user) => {
    console.log(req.body.userid)
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      Home.findOne({
        userid: user.id,
        homeip: req.body.homeip
        }).exec((err, home) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (home) {
          res.status(400).send({
            message: "Failed!",
            status: "homeip is valid"
            });
          return;
        }
        next();
      });
      return;
    }
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};


checkDuplicateHome = (req, res, next) => {
  User.findOne({
    _id: req.body.userid
  }).exec((err, user) => {
    console.log(req.body.userid)
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      Home.findOne({
        homeip: req.body.homeip
        }).exec((err, home) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (home) {
          res.status(400).send({
            message: "Failed!",
            status: "homeip is valid"});
          return;
        }
        if (!home) {
        Home.findOne({
          userid: user.id,
          homeip: req.body.homename
          }).exec((err, home) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
            }
          if (home) {
            res.status(400).send({
              message: "Failed!",
              status: "homename is valid"});
            return;
            }
          // next();
          });
        }
        next();
      });
      return;
    }
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

findHomeName = (req, res, next) => {
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
  checkDuplicateHomeIp,
  checkDuplicateHome,
  findHomeName
};
module.exports = controlHome;