const { controlRoom }   = require("../middlewares");
const { authJwt }   = require("../middlewares");
const controller = require("../controllers/room.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/add/newroom",
    [
      authJwt.verifyToken,
      controlRoom.checkDuplicateRoomName
    ],
    controller.addnewroom
    );

  app.delete(
    "/api/delete/room",
    [
      authJwt.verifyToken,
      controlRoom.findRoomName
    ],
    controller.deleteroom
    );

  app.get(
    "/api/list/room",
    [
      authJwt.verifyToken,
      controller.listRoomName
    ],
    );
};