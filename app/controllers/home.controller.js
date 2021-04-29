const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Home = db.home;
const Room = db.room;
const Device = db.device;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { home } = require("../models")
const { room } = require("../models");
const { device } = require("../models");

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
  console.log("Delete: "+ req.query);
  Home.findOne({
    _id: req.query.homeid
  })
      .populate("roles", "-__v")
      .exec((err, home) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        // if (!home) {
        //   return res.status(404).send({ message: "Failed ! Home Not found." });
        // }
        let ts = Date.now();
        let date_ob = new Date(ts);
        console.log(date_ob + ": deletehome");
        console.log(home);
        let homedelete = home;
        if (home){
          Home.deleteOne({
            _id: homedelete._id
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
  console.log("**********************")
  console.log(req.query);
  Home.find({
    userid: req.query.userid
  }).exec((err, home) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (home) {
      console.log("list home done");
      res.status(200).send({
        home: home
      })
      return;
    }
    res.status(404).send({ message: "Failed! home is invalid" });
    return;
  });
};

exports.editHome = (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  console.log(date_ob + ": ***** editHome *****");

  console.log("req: ", req.body)
  
  Home.findOne({
    _id: req.body.homeid
    }).exec((err, homeedit) => {
        if (err) {
          res.status(500).send({
            message: "error",
            error: err
            });
          return;
        }
        console.log("home edit: "+ homeedit);

        if (homeedit) {
          var home_newinfo = {$set: {homename : req.body.new_homename,
                                    homeip   : req.body.new_homeip,
                                    ssid     : req.body.new_ssid,
                                    wifipassword: req.body.new_wifipassword,
                                    homeimage   : req.body.new_homeimage,
                                    address     : req.body.new_address
                                    }};
          Home.updateOne(
            homeedit,
            home_newinfo
            ).exec((err, homeupdate) => {
              if (err) {
                res.status(500).send({
                  message: "error",
                  home: home});
                return;
              }
              
              Home.findOne({
                _id: req.body.homeid
                }).exec((err, home) => {
                  if (err) {
                    res.status(500).send({
                      message: "error",
                      bugs: err
                      });
                    return;
                  }
                  if (home) {
                    return res.status(200).send({
                      message: "sucess",
                      home: home
                      });
                  };
                });
              });
        }
    });
  };