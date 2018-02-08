/* In order to secure a route, use passport.authenticate('jwt', {session: false}) */

// Create an express router
var router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../config/passport')(passport);
const dbConfig = require('../config/database');
const sendEmailHelper = require('../utils/emailHelper');

var request = require("request-json");
var url = require("url");

//  email
router.get('/sendEmail', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  let toUserEmail = req.body;
  console.log("to user email : "+toUserEmail);
  sendEmailHelper.sendEmail("hosamcheung@gmail.com", 1, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to send email!" + error});
       }
    else{
        // console.log(callback.statusCode);
        // console.log(callback.body);
        // console.log(callback.headers);
      res.json({success: true, message: "email is sent successfully"});
    }
  })
});

// make our router available globally
module.exports = router;