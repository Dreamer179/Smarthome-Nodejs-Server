const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Home = db.home;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { home } = require("../models");

// let date_ob = new Date();

exports.addnewhome = (req, res) => {
    const home = new Home({
      username: req.body.username,
      homename: req.body.homename,
      homeip:   req.body.homeip,
      macaddress: req.body.macaddress,
      homeimage: req.body.homeimage,
      address: req.body.address
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    console.log(date_ob + ": addnewhome");
    home.save((err, home) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      home.save(err => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.status(200).send({
          home: home
        });
      });
    });
  };


exports.deletehome = (req, res) => {
    Home.findOne({
      _id: req.body._id,
      username: req.body.username,
      homename: req.body.homename,
    })
        .populate("roles", "-__v")
        .exec((err, home) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!home) {
            return res.status(404).send({ message: "Failed ! Home Not found." });
          }
          let ts = Date.now();
          let date_ob = new Date(ts);
          console.log(date_ob + ": deletehome");
          console.log(home);
          let homedelete = home;
          if (home){
            Home.deleteOne({
              _id: req.body._id
              }).exec((err, home) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              if (home) {
                return res.status(200).send({
                  home: homedelete
                  });
              }
            });
            return;
          }
          });
  };


exports.listHomeName = (req, res) => {
  User.find({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      Home.find({
        username: req.body.username
        }).exec((err, home) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (home) {
          console.log(home)
          res.status(200).send({
            home: home
          })
          return;
        }
      });
      return;
    }
    // Tim khong thay username
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

