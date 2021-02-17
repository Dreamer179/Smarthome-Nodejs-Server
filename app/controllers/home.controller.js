const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Home = db.home;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { home } = require("../models")

exports.addnewhome = (req, res) => {
    const home = new Home({
      userid: req.body.userid,
      homename: req.body.homename,
      homeip:   req.body.homeip,
      ssid:     req.body.ssid,
      wifipassword: req.body.wifipassword,
      homeimage: req.body.homeimage,
      address: req.body.address,
      status: req.body.status,
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
      _id: req.body.homeid
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
              _id: req.body.homeid
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
    _id: req.body.userid
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      Home.find({
        userid: req.body.userid
        }).exec((err, home) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (home) {
          console.log("list home")
          res.status(200).send({
            home: home 
          })
          return;
        }
      });
      return;
    }
    res.status(404).send({ message: "Failed! user is invalid" });
    return;
  });
};

