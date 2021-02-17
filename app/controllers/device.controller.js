const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Room = db.room;
const Device = db.device;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { home } = require("../models");
const { room } = require("../models");
const { device } = require("../models");

var mqtt = require('mqtt')
var settings = {
    mqttServerUrl : "localhost",
    port : 18833
    }
var client  = mqtt.connect('mqtt://' + settings.mqttServerUrl + ":" + settings.port);

exports.addnewdevice = (req, res) => {
    const device = new Device({
      homeid: req.body.homeid,
      roomid: req.body.roomid,
      devicename: req.body.devicename,
      devicetype:   req.body.devicetype,
      deviceorder:     req.body.deviceid,
      status:   req.body.status
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    console.log(date_ob + ": addnewdevice");
    //
    Room.findOne({
      _id: req.body.roomid
      }).exec((err, room) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (room) {
        device.save((err, device) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          device.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            /////////////public mqtt///////////////
            topic = room.macaddess
            client.on('connect', function () {
              var message = "Hello mqtt";
              client.publish(settings.topic, message);
              console.log('Sent ' + message + " to " + settings.topic);
              });
            ////////////////////////////////
            res.status(200).send({
              device: device
            });
          });
        });
      }
      res.status(404).send({ message: "Failed! room is invalid" });
      return;
    });
    //
  };


exports.deletedevice = (req, res) => {
    Device.findOne({
      _id: req.body._id
    })
        .populate("roles", "-__v")
        .exec((err, device) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!device) {
            return res.status(404).send({ message: "Failed ! Device Not found." });
          }
          let ts = Date.now();
          let date_ob = new Date(ts);
          console.log(date_ob + ": deletedevice");
          console.log(device);
          let devicedelete = device;
          if (device){
            Device.deleteOne({
              device
              }).exec((err, device) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              if (device) {
                return res.status(200).send({
                  device: devicedelete
                  });
              }
            });
            return;
          }
          });
  };


exports.listDeviceName = (req, res) => {
  Device.find({
    roomid: req.body.roomid,
  }).exec((err, device) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (device) {
      console.log(device)
      res.status(200).send({
        device: device
      })
      return;
    }
    res.status(404).send({ message: "Failed! device is invalid" });
    return;
  });
};

