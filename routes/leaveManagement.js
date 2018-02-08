/* In order to secure a route, use passport.authenticate('jwt', {session: false}) */

// Create an express router
var router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Leave = require('../models/leave');
const Employee = require('../models/employee');
const dbConfig = require('../config/database');

// get Leave record by employeeId
router.get('/getAllLeaves', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  Leave.getAllLeaves((error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to get leaves!" + error});
       }
    else{
      res.json({success: true, message: "leaves are gotten successfully", leaveTableData: callback});
    }
  })
});

// save all Leaves
router.post('/saveAllLeaves', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  let allLeaves = req.body;
  Leave.saveAllLeaves(allLeaves, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to save leaves!" + error});
       }
    else{
      res.json({success: true, message: "leaves are saved successfully", allLeaves: callback});
    }
  })
});

// make our router available globally
module.exports = router;