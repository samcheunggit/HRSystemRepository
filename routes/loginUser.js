/* In order to secure a route, use passport.authenticate('jwt', {session: false}) */

// Create an express router
var router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../config/passport')(passport);
var async = require('async');
var crypto = require('crypto');
const LoginUser = require('../models/loginUser');
const dbConfig = require('../config/database');
const sendEmailHelper = require('../utils/emailHelper');

var request = require("request-json");
var url = require("url");


// Add login User
router.post('/register', (req, res, next)=>{
  
  let randomPassword = Math.random().toString(36).substring(7);
  let createDate = new Date().toJSON();
  // define a new login user object and assign incoming request parameter to object
  let newLoginUser = new LoginUser({
    _id: req.body.userid,
    username: req.body.fullname.replace(/\s/g,'').toLowerCase(),
    password: randomPassword,
    email: req.body.email,
    createdate: createDate,
    isactive: true,
    employeeid: req.body._id,
    usertype: "",
    resetPasswordToken: "",
    resetPasswordExpires: ""
  });
  
  // Check if the user exist 
  LoginUser.getLoginUserByUserName(newLoginUser.username, (error, loginUser)=>{
    if(error) throw error;
    
    if(loginUser){
      return res.json({success: false, message: "User "+loginUser.username+" already exists!"});
    }
    else{
      // add addloginUser route
      LoginUser.addLoginUser(newLoginUser, (error, loginUser)=>{
        console.log("Login User Name and Password: "+loginUser.username+" "+randomPassword);
        if(error){
          res.json({success: false, message: "Failed to register User!" + error});
          }
        else{

          // call the functions one by one
          async.waterfall([
            // first function: create random unique token
            (callback)=> {
              crypto.randomBytes(20, (error, buf)=>{
              var token = buf.toString('hex');
              callback(error, token);
              });
            },
            // second function: update the login user with token and expired time
            (token, callback) => {
              loginUser.resetPasswordToken = token;
              loginUser.resetPasswordExpires = Date.now() + 86400000; // 24 hours
              
              LoginUser.saveUserDetails(loginUser, (error, savedLoginUser) =>{
                callback(error, token, savedLoginUser)
              });
            },
            // third function: send token for reset the password through email
            (token, user, callback) => {
              // build email object
              let emailObj = {toUser: req.body.email, userName: loginUser.username, token: token, url: req.headers.host};
              sendEmailHelper.sendWelcomeEmail(emailObj, (error, callback)=>{
                if(error){
                   res.json({success: false, message: "Failed to send welcome email!" + error});
                   }
                else{
                  res.json({success: true, message: "welcome email is sent successfully"});
                }
              })
            }
          ], (error) => {
            if (error) return next(error);
          });
        }
      })
    }
  });
});

// Authentication
router.post('/authenticate', (req, res, next)=>{
  const username = req.body.username;
  const password = req.body.password;
  
  LoginUser.getLoginUserByUserName(username, (error, loginUser)=>{
    if(error) throw error;
    
    if(!loginUser){
      return res.json({success: false, message: "Login User not found!"});
    }
    else{
       LoginUser.passwordValidation(password, loginUser.password, (error, isMatch)=>{
         if(isMatch){
              // reconstruct new loginUser object for current loginUser
              const signedLoginUser = {
                  id: loginUser._id,
                  username: loginUser.username,
                  email: loginUser.email,
                  employeeid: loginUser.employeeid,
                  usertype: loginUser.usertype
                };
              // create token for signed user jwt.sign(payload, secretOrPrivateKey, [options, callback])
              const token = jwt.sign(signedLoginUser, dbConfig.secret, {
                expiresIn: '1h'   // expired in 1 hour 
              });
              // return token and login user object without password
              res.json({
                success: true,
                token: token,
                loginUser: signedLoginUser
              });
            }
         else{
           return res.json({success: false, message: "Wrong Password!"});
         }
       })
    }
    
  });
  
});

// login user details
// By default, if authentication fails, Passport will respond with a 401 Unauthorized status, 
// and any additional route handlers will not be invoked. 
// If authentication succeeds, the next handler will be invoked 
// and the req.user property will be set to the authenticated user.
router.get('/details', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  res.json({loginUser: req.user});
});

router.get('/deleteLoginUserByEmployeeId', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  // delete Login User route
  LoginUser.deleteLoginUserByEmployeeId(req.query.loginUserId, (error)=>{
    if(error){
       res.json({success: false, message: "Failed to delete login user!" + error});
       }
    else{
      res.json({success: true, message: "login user deleted successfully"});
    }
  })
});

// delete Login User By EmployeeId
router.delete('/deleteLoginUserByEmployeeId', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  
  // deleteLoginUserByEmployeeId route
  LoginUser.deleteLoginUserByEmployeeId(req.query.employeeId, (error)=>{
    if(error){
       res.json({success: false, message: "Failed to delete login user!" + error});
       }
    else{
      res.json({success: true, message: "login user deleted successfully"});
    }
  })
});

// get all login users
router.get('/getAllUsers', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  // get all login users route
  LoginUser.getAllUsers((error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to get all users!" + error});
       }
    else{
      res.json({success: true, message: "login users are retrieved successfully", users: callback});
    }
  })
});

// save user details
router.post('/saveUserDetails', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  let user = req.body;
  LoginUser.saveUserDetails(user, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to save user!" + error});
       }
    else{
      res.json({success: true, message: "user are saved successfully", users: callback});
    }
  })
});

// handle forgot password route
router.post('/forgotPassword', (req, res, next)=>{
  
  // call the functions one by one
  async.waterfall([
    // first function: create random unique token
    (callback)=> {
      crypto.randomBytes(20, (error, buf)=>{
      var token = buf.toString('hex');
      callback(error, token);
      });
    },
    // second function: check the loginuser by email whether it is exist or not
    (token, callback) => {
      LoginUser.getLoginUserByEmail(req.body.email, (error, loginUser)=>{
        if(!loginUser){
          error = "no user found!";
          res.json({success: false, message: "No User Found!"});
        }
        callback(error, token, loginUser)
      });
    },
    // third function: update the login user with token and expired time
    (token, loginUser, callback) => {
      loginUser.resetPasswordToken = token;
      loginUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      
      LoginUser.saveUserDetails(loginUser, (error, savedLoginUser) =>{
        callback(error, token, savedLoginUser)
      });
    },
    // forth function: send token for reset the password through email
    (token, user, callback) => {
      // build email object, type 1 means add new login user email template
      let emailObj = {toUser: user.email,token: token, url: req.headers.host};
      sendEmailHelper.sendResetEmail(emailObj, (error, callback)=>{
        if(error){
           res.json({success: false, message: "Failed to send email!" + error});
           }
        else{
          res.json({success: true, message: "reset password email is sent successfully"});
        }
      })
    }
  ], (error) => {
    if (error) return next(error);
  });
});

router.get('/checkResetPasswordTokenValidity', (req, res, next)=>{
  
  LoginUser.getLoginUserByResetPWToken(req.query.token, (error, loginUser)=>{
    console.log("reset password token ",req.query.token);
    if(!loginUser){
      console.log("user not found");
      res.json({success: false, message: "Password reset token is invalid or has expired." + error});
    }
    else{
      res.json({success: true, message: "Token is valid.", loginUser: loginUser});
    }
  });
});

// reset password
router.post('/resetPassword', (req, res, next)=>{

  // call the functions one by one
  async.waterfall([
    // first function: create random unique token
    (callback)=> {
      LoginUser.getLoginUserByResetPWToken(req.body.token, (error, loginUser)=>{
        console.log("reset password token in reset password ",req.body.token);
        if(!loginUser){
          console.log("user not found");
          res.json({success: false, message: "Password reset token is invalid or has expired." + error});
        }
        
        callback(error, loginUser)
      });
    },
    // second function: check the loginuser by email whether it is exist or not
    (loginUser, callback) => {
      
      console.log("login user in reset password: ",loginUser);
      if(loginUser){
        LoginUser.resetPassword({loginUserId: loginUser._id, newPassword: req.body.password}, (error, callback)=>{
          if(error){
            res.json({success: false, message: "Failed to save user!" + error});
          }
          else{
            res.json({success: true, message: "user are saved successfully", users: callback});
          }
        })
      }
      
    }
  ], (error) => {
    if (error) return next(error);
  });
});

// make our router available globally
module.exports = router;