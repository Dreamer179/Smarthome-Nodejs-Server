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

var mqtt = require('mqtt');
const Home = require("../models/home.model");
var settings = {
    mqttServerUrl : "localhost",
    port : 18833
    }
var client  = mqtt.connect('mqtt://' + settings.mqttServerUrl + ":" + settings.port);

exports.addnewdevice = (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    console.log(date_ob + ": addnewdevice");
    Room.findOne({
      _id: req.body.roomid
      }).exec((err, room) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (room) {
        
        var list_type = ["ONOFF", "DIMMER", "CURTAIN"];
        var list_status = ["OFF", "0", "0"]
        var valid = list_type.includes(req.body.devicetype);
        
        if (valid){
          const deviceadded = new Device({
            userid:   req.body.userid,
            homeid:   req.body.homeid,
            roomid:   req.body.roomid,
            roomip:   room.roomip,
            devicename: req.body.devicename,
            deviceip:   req.body.deviceip,
            devicetype: req.body.devicetype,
            status:     list_status[list_type.indexOf(req.body.devicetype)]
          });

          deviceadded.save((err, device) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            if (device) {
              res.status(200).send({ device: deviceadded});
              return;
            };
          });
        }
        else {
          return res.status(500).send({
            message: "error",
            error: "devicetype not in accepted devices"
            });
        }
      };
    });
  };


exports.deletedevice = (req, res) => {
    Device.findOne({
      _id: req.query.deviceid
    })
        .populate("roles", "-__v")
        .exec((err, device) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          let ts = Date.now();
          let date_ob = new Date(ts);
          console.log(date_ob + ": deletedevice");
          console.log(device);
          let devicedelete = device;
          if (device){
            Device.deleteOne({
              _id: req.query.deviceid
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
          res.status(404).send({ message: "Failed ! Device Not found." });
          return;
          });
  };


exports.listDeviceName = (req, res) => {
  Device.find({
    roomid: req.query.roomid,
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


exports.controlDevice = (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  console.log(date_ob + ": controldevice");
  
  Device.findOne({
      _id: req.body.deviceid
      }).exec((err, device) => {
      if (err) {
      res.status(500).send({ message: err });
      return;
      }
      if (device) {

        if (device.devicetype == "ONOFF" && !(['ON', 'OFF'].includes(req.body.status))){
          res.status(500).send({ message: "error",
                                 error: "value unexpected" });
          return;
        }
        else if (["DIMMER", "CURTAIN"].includes(device.devicetype) && !(parseInt(req.body.status, 10) <= 100 && parseInt(req.body.status, 10) >= 0)){
          res.status(500).send({ message: "error",
                                 error: "value unexpected" });
          return;
        }
        if (req.body.status == "ON" || (parseInt(req.body.status, 10) <= 100 && parseInt(req.body.status, 10) > 0)) {
          Room.findOne({
            _id: device.roomid
          }).exec((err, room) => {
            if (err){
              res.status(500).send({
                messsage: "error",
                error: err
              });
              return;
            }
            if (room){
              console.log("Room new status: ", room);
              const string = "true"
              console.log("status: ", string, typeof string)
              var room_newstatus = {$set: {status: 'true'}};
              Room.updateOne(
                room,
                room_newstatus
                ).exec((err, roomupdate) => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                    }
                  });
            }
          });
        }
        var device_newstatus = {$set: {status: req.body.status}};
        var client  = mqtt.connect('mqtt://' + settings.mqttServerUrl + ":" + settings.port);
        
        Device.updateOne(
            device,
            device_newstatus
            ).exec((err, deviceupdate) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
              }

            client.on('connect', function () {
              var message = device.deviceip +":"+ req.body.status+":";
              client.publish(device.roomip, message);
              console.log('Sent ' + message + " to " + device.roomip);
            });

            return res.status(200).send({
              message: "sucess",
              device_status: req.body.status
              });
        });
        }
  });
  };

  exports.editDevice = (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    console.log(date_ob + ":***** editDevice *****");
    console.log("req: ", req.body)
    
    Device.findOne({
        _id: req.body.deviceid
        }).exec((err, device) => {
        if (err) {
        res.status(500).send({
          message: "error",
          error: err
          });
        return;
        }
        console.log("device edit: "+device);
        if (device) {
        // console.log("device"+device);
        var list_type = ["ONOFF", "DIMMER", "CURTAIN"];
        var list_status = ["OFF", "0", "0"]
        var valid = list_type.includes(req.body.new_devicetype);
  
        if (valid) {
        var device_newinfo = {$set: {devicename: req.body.new_devicename,
                                    deviceip  : req.body.new_deviceip,
                                    devicetype: req.body.new_devicetype,
                                    status: list_status[list_type.indexOf(req.body.new_devicetype)]
                                  }};
        Device.updateOne(
            device,
            device_newinfo
            ).exec((err, deviceupdate) => {
              if (err) {
                res.status(500).send({
                  message: "error",
                  error: err});
                return;
                }
              
              Device.findOne({
                _id: req.body.deviceid
                }).exec((err, device) => {
                if (err) {
                  res.status(500).send({
                    message: "error",
                    error: err
                    });
                  return;
                }
                if (device) {
                  return res.status(200).send({
                    message: "sucess",
                    device: device
                    });
                  };
                });
              });
            }
            else {
              return res.status(500).send({
                message: "error",
                error: "devicetype not in accepted devices"
                });
            }
        }
      });
    };