/* In order to secure a route, use passport.authenticate('jwt', {session: false}) */

// Create an express router
var router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../config/passport')(passport);
const LoginUser = require('../models/loginUser');
const dbConfig = require('../config/database');


// Add login User
router.post('/register', (req, res, next)=>{

  let randomPassword = Math.random().toString(36).substring(7);
  let createDate = new Date().toJSON();
  // define a new login user object and assign incoming request parameter to object
  let newLoginUser = new LoginUser({
    _id: req.body.userid,
    username: req.body.fullname.replace(/\s/g,'').toLowerCase(),
    password: randomPassword,
    email: "",
    createdate: createDate,
    isactive: true,
    employeeid: req.body._id,
    usertype: ""
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
          res.json({success: true, message: "User registered successfully", loginUser: loginUser});
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

// make our router available globally
module.exports = router;