const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://0.0.0.0:8081"
};

const mosca = require('mosca');
// var settings = {
//   port : 18833
// }

var settings = {
  host: '0.0.0.0',
  port: 18833,
  http: {
      port: 8002,
      host: '0.0.0.0',
      static: './mqtt/',
      bundle: true,
  },
};

var server = new mosca.Server(settings);
// fired client is connected
server.on('clientConnected', function(client) {
console.log('Client connected', client.id);
});
// fired when a message is received
server.on('published', function(packet, client) {
console.log('Message Received ', packet.payload);
});
server.on('ready', setup);
// fired when the mqtt server is ready
function setup() {
console.log('Mosca MQTT server is up and running at ' + settings.port);
}


const db = require("./app/models");
const Role = db.role;
const dbConfig = require("./app/config/db.config");

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

app.use(function (error, req, res, next) {
  if (!error) {
    next();
  } else {
    console.error(error.stack);
    res.send(500);
  }
});

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to VNTALKING application." });
});
// set port, listen for requests
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

// app.listen(8080, '0.0.0.0', function() {
//   console.log('Listening to port:  ' + 8080);
// });

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on port ${PORT}.`);
});

// routes
require('./app/routes/auth.routes')(app);
// require('./app/routes/user.routes')(app);
require('./app/routes/home.routes')(app);
// set port, listen for requests
require('./app/routes/room.routes')(app);
require('./app/routes/device.routes')(app);
