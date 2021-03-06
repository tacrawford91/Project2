var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
var passport = require("passport");
var session = require("express-session");
var bdyParser = require ("body-parser");
var env = require("dotenv").load();
var PORT = process.env.PORT || 3000;

// Requiring our models for syncing
var db = require("./app/models");

//Set Up Middleware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret

app.use(passport.initialize());

app.use(passport.session()); // persistent login sessions

// Static directory
app.use(express.static("./app/public"));

var htmlRoutes = require("./app/controller/htmlRoutes.js");
var parkApiRoutes = require("./app/controller/parkApiRoutes.js");
var userApiRoutes = require("./app/controller/userApiRoutes.js");

//Use routes - 
app.use("/", htmlRoutes);
app.use("/api", parkApiRoutes);
app.use("/api", userApiRoutes);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({force:false}).then(function() {
    const io = require('socket.io').listen( app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    }));

    io.on('connection', function (socket) {
      console.log("Socket connected on port " + PORT);
      
      // io.emit("test1", {test: "can you see this?"})

      socket.on("dogCountUpdate", function(data){
      io.sockets.emit("dogCountUpdate", {data});
      // console.log(data);
      })
  });

  
});