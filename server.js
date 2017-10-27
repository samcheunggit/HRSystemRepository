// // server.js
const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Cross Origin Resources Sharing
const passport = require('passport');
// define routes
const loginUser = require('./routes/loginUser');
const employee = require('./routes/employee');

// require database configuration
const dbConfig = require('./config/database');

const app = express();

// Mongo DB Connection
mongoose.Promise = global.Promise;
// Using `mongoose.connect`...
mongoose.connect(dbConfig.url, {
  useMongoClient: true
});

mongoose.connection.on('connected', () => {
  console.log("connected to mongodb: "+dbConfig.url);
});

mongoose.connection.on('error', (e) => {
  console.log("Database Error: "+e);
});

// const forceSSL = function() {
//   return function (req, res, next) {
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//       return res.redirect(
//        ['https://', req.get('Host'), req.url].join('')
//       );
//     }
//     next();
//   }
// }

// Instruct the app to use the forceSSL middleware
// app.use(forceSSL());

//Set static folder
app.use(express.static(path.join(__dirname, 'dist')));

// use cors because during development server and angular app are in diff. port
// in order to make request from frontend
app.use(cors());

// Parse incoming request body so when you sumbit the form you can grab the data
app.use(bodyParser.json());

// Passort is for login authentication
app.use(passport.initialize());
app.use(passport.session());

// Tell our app to use the Users routes defined in ./routes/loginUser.js
app.use('/loginUser', loginUser);
app.use('/employee', employee);

// Index route for angular front
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// set port for node server
const port = process.env.PORT || '3000';
app.set('port', port);

// create server and listen to the port we set
const server = http.createServer(app);
server.listen(port, ()=>console.log('Server is running at port: '+port));