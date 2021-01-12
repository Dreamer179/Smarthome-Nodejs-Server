const { controlHome }   = require("../middlewares");
const { authJwt }   = require("../middlewares");
const controller = require("../controllers/home.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/add/newhome",
    [
      authJwt.verifyToken,
      controlHome.checkDuplicateHomeName
    ],
    controller.addnewhome
    );

  app.delete(
    "/api/delete/home",
    [
      authJwt.verifyToken,
      controlHome.findHomeName
    ],
    controller.deletehome
    );

  app.get(
    "/api/list/home",
    [
      authJwt.verifyToken,
      controller.listHomeName
    ],
    );
};