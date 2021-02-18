const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Room = db.room;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { home } = require("../models");
const { room } = require("../models");
const { authJwt }   = require("../middlewares");

exports.addnewroom = (req, res) => {
    const room = new Room({
      userid: req.body.userid,
      homeid: req.body.homeid,
      roomname: req.body.roomname,
      roomimage: req.body.roomimage,
      roomip: req.body.roomip,
      status:   req.body.status
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    console.log(date_ob + ": addnewroom");
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
    Room.findOne({
      _id: req.body.roomid,
      homeid: req.body.homeid,
      userid: req.body.userid
    })
        .populate("roles", "-__v")
        .exec((err, room) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          if (!room) {
            return res.status(404).send({ message: "Failed ! Room Not found." });
          }
          let ts = Date.now();
          let date_ob = new Date(ts);
          console.log(date_ob + ": deleteroom");
          // console.log(room);
          let roomdelete = room;
          if (room){
            Room.deleteOne({
              _id: req.body.roomid,
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
  Room.find({
    userid: req.body.userid,
    homeid: req.body.homeid
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

