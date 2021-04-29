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
const { authJwt }   = require("../middlewares");

var mqtt = require('mqtt')
var settings = {
    mqttServerUrl : "localhost",
    port : 18833
    }
var client  = mqtt.connect('mqtt://' + settings.mqttServerUrl + ":" + settings.port);

exports.addnewroom = (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  console.log(date_ob + ": ***** addnewroom *****");

  const room = new Room({
    userid: req.body.userid,
    homeid: req.body.homeid,
    roomname: req.body.roomname,
    roomimage: req.body.roomimage,
    roomip: req.body.roomip,
    status:   req.body.status
  });
  
  room.save((err, room) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    room.save(err => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        room: room
      });
    });
  });
};


exports.deleteroom = (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  console.log(date_ob + ": ***** deleteroom *****");
  Room.findOne({
    _id: req.query.roomid
  })
      .populate("roles", "-__v")
      .exec((err, room) => {
        if (err) {
          res.status(500).send({
            message: "error",
            error: err
          });
          return;
        }
        // if (!room) {
        //   return res.status(404).send({ message: "Failed ! Room Not found." });
        // }
        // console.log(room);
        let roomdelete = room;
        if (room){
          Room.deleteOne({
            _id: req.query.roomid
            }).exec((err, room) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            if (room) {
              return res.status(200).send({
                room: roomdelete
                });
            }
          });
          return;
        }
        });
  };

exports.listRoomName = (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  console.log(date_ob + ": ***** list room *****");
  Room.find({
    userid: req.query.userid,
    homeid: req.query.homeid
  }).exec((err, room) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
      }
    if (room) {
      console.log(room)
      res.status(200).send({
        room: room
      })
      return;
      }
    res.status(404).send({ message: "Failed! room is invalid" });
    return;
  });
};

exports.controlRoom = (req, res) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  console.log(date_ob + ": ***** controlroom *****");
  
  Room.findOne({
      _id: req.body.roomid
      }).exec((err, room) => {
      if (err) {
      res.status(500).send({ message: err });
      return;
      }

      if (!(["true", "false"].includes(req.body.status))){
        res.status(500).send({
          message: "error",
          status: "status must be boolean"
        });
      return;
      }
      if (room) {
        console.log("req.body.status: ", req.body.status, typeof req.body.status)
        var room_newstatus = {$set: {status: req.body.status}};

        var client  = mqtt.connect('mqtt://' + settings.mqttServerUrl + ":" + settings.port);
        console.log("Control room: ", room)
        Room.updateOne(
            room,
            room_newstatus
            ).exec((err, roomupdate) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
              }

            client.on('connect', function () {
              var message = req.body.status;
              client.publish(room.roomip, message);
              console.log('Sent ' + message + " to " + room.roomip);
            });
        });

        Device.find({
          roomid: req.body.roomid
          }).exec((err, device) => {
          if (err) {
          res.status(500).send({ message: err });
          return;
          }
          if (device) {
            var new_status = "OFF";
            var dimmer_status = "0";
            if (req.body.status == "true"){
              var new_status = "ON";
              var dimmer_status = "100";
            }else{
              var new_status = "OFF"
              var dimmer_status = "0";
            }
            var device_newstatus = {$set: {status: new_status}};
            var dimmer_newstatus = {$set: {status: dimmer_status}};
            var client  = mqtt.connect('mqtt://' + settings.mqttServerUrl + ":" + settings.port);
            console.log("device_newstatus: ", device_newstatus);
            client.on('connect', function () {
              var message = req.body.status;
              client.publish(device.roomip, message);
              console.log('Sent ' + message + " to " + room.roomip);
            });

            for (const sub_device of device){
              if (sub_device.devicetype == "ONOFF"){
                console.log("Updated device: ", device_newstatus);
                Device.updateOne(
                  sub_device,
                  device_newstatus
                  ).exec((err, deviceupdate) => {
                  if (err) {
                    res.status(500).send({
                      message: "error",
                      status: err
                    });
                    return;
                    }
                  });
              }else if (sub_device.devicetype == "DIMMER"){
                console.log("Updated dimmer")
                Device.updateOne(
                  sub_device,
                  dimmer_newstatus
                  ).exec((err, deviceupdate) => {
                  if (err) {
                    res.status(500).send({
                      message: "error",
                      status: err
                    });
                    return;
                    }
                  });
              }else{
                console.log("Cannot update device curtain");
              }
            };
            return res.status(200).send({
              message: "sucess",
              device_status: req.body.status
              });

            }else{
              res.status(200).send({
                message: "success",
                status: "there are no device in room"
              });
              return;
            }
          
          });
        }
  });
  };


  // exports.controlRoom = (req, res) => {
  //   let ts = Date.now();
  //   let date_ob = new Date(ts);
  //   console.log(date_ob + ": ***** controlroom *****");
    
  //   Room.findOne({
  //       _id: req.body.roomid
  //       }).exec((err, room) => {
  //       if (err) {
  //       res.status(500).send({ message: err });
  //       return;
  //       }
  //       if (room) {
  
  //       var room_newstatus = {$set: {status: req.body.status}};
  
  //       var client  = mqtt.connect('mqtt://' + settings.mqttServerUrl + ":" + settings.port);
  
  //       Room.updateOne(
  //           room,
  //           room_newstatus
  //           ).exec((err, roomupdate) => {
  //           if (err) {
  //             res.status(500).send({ message: err });
  //             return;
  //             }
  
  //           client.on('connect', function () {
  //             var message = req.body.status;
  //             client.publish(room.roomip, message);
  //             console.log('Sent ' + message + " to " + room.roomip);
  //           });
  //           return res.status(200).send({
  //             message: "sucess",
  //             room_status: req.body.status
  //             });
  //       });
  //       }
  //   });
  //   };


  exports.editRoom = (req, res) => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    console.log(date_ob + "***** editRoom *****");
    console.log("req: ", req.body)
    
    Room.findOne({
        _id: req.body.roomid
        }).exec((err, roomedit) => {
        if (err) {
        res.status(500).send({
          message: "error",
          error: err
          });
        return;
        }
        console.log("room edit: "+roomedit);
        if (roomedit) {
          var room_newinfo = {$set: {
                                      roomname: req.body.new_roomname,
                                      roomimage: req.body.new_roomimage,
                                      roomip  : req.body.new_roomip
                                  }};
          Room.updateOne(
            roomedit,
            room_newinfo
            ).exec((err, roomupdate) => {
              if (err) {
                res.status(500).send({
                  message: "error",
                  error: err});
                return;
                }
                // return res.status(200).send({message: "OK"});
              if(roomupdate){
                Room.findOne({
                  _id: req.body.roomid
                  }).exec((err, room) => {
                  if (err) {
                    res.status(500).send({
                      message: "error",
                      error: err
                      });
                    return;
                  }
                  if (room) {
                    return res.status(200).send({
                      message: "sucess",
                      room: room
                      });
                    };
                  });
              };
            });
        }
      });
    };