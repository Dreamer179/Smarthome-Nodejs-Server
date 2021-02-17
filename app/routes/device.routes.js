const { controlDevice }   = require("../middlewares");
const { authJwt }   = require("../middlewares");
const controller = require("../controllers/device.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/add/newdevice",
    [
      authJwt.verifyToken,
      controlDevice.checkDuplicateDevice
    ],
    controller.addnewdevice
    );

  app.delete(
    "/api/delete/device",
    [
      authJwt.verifyToken,
      controlDevice.findDeviceName
    ],
    controller.deletedevice
    );

  app.get(
    "/api/list/room",
    [
      authJwt.verifyToken,
      controller.listDeviceName
    ],
    );
};