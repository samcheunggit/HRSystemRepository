/* In order to secure a route, use passport.authenticate('jwt', {session: false}) */

// Create an express router
var router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Leave = require('../models/leave');
const LeaveDetails = require('../models/leavedetails');
const dbConfig = require('../config/database');
const globalConstants = require('../constants/globalConstants');
const generalUtils = require('../utils/generalUtils');

// Create Leave record for new employee
router.post('/createLeave', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{

  // initialize the default leave instance
  let defaultLeave = new Leave({
    _id: req.body.leaveid,
    employeeid: req.body._id,
    employeename: req.body.fullname,
    annualleave: globalConstants.defaultAnnualLeave,
    sickleave: globalConstants.defaultLeave,
    overtimeleave: globalConstants.defaultLeave,
    healthleave: globalConstants.defaultLeave,
    maternityleave: globalConstants.defaultLeave,
    marriageleave: globalConstants.defaultLeave,
    funeralleave: globalConstants.defaultLeave,
    otherleave: globalConstants.defaultLeave
  });
  
  Leave.createLeave(defaultLeave, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to create default leave!" + error});
       }
    else{
       res.json({success: true, message: "leave is created successfully", leave: new Leave(callback)});
    }
  })
});

// get Leave record by employeeId
router.get('/getLeavesByEmployeeId', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  Leave.getLeavesByEmployeeId(req.query.employeeId, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to get leave!" + error});
       }
    else{
       res.json({success: true, message: "leave is gotten successfully", leave: new Leave(callback)});
    }
  })
  
});

// get Leave Details record by employeeId
router.get('/getLeaveDetailsByEmployeeId', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  LeaveDetails.getLeaveDetailsByEmployeeId(req.query.employeeId, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to get leave details!" + error});
       }
    else{
       res.json({success: true, message: "leave details is gotten successfully", leave: callback});
    }
  })
  
});

// update employee name for leave
router.post('/updateEmployeeNameForLeave', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{

  Leave.updateEmployeeNameForLeave(req.body, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to save employee name for leave!" + error});
       }
    else{
       res.json({success: true, message: "employee name in leave is saved successfully", leave: new Leave(callback)});
    }
  })
  
});

// save Leave record
router.post('/saveLeave', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{

  Leave.saveLeave(req.body, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to save leave!" + error});
       }
    else{
       res.json({success: true, message: "leave is saved successfully", leave: new Leave(callback)});
    }
  })
  
});

// save Leave Details
router.post('/saveLeaveDetails', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  
  let leaveDetails = new LeaveDetails(req.body)
  
  LeaveDetails.saveLeaveDetails(leaveDetails, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to save leave details!" + error});
       }
    else{
       res.json({success: true, message: "leave details is saved successfully", leave: new LeaveDetails(callback)});
    }
  })
  
});

// delete Leave
router.delete('/deleteLeaveByEmployeeId', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  
  // deleteLeave route
  Leave.deleteLeaveByEmployeeId(req.query.employeeId, (error)=>{
    if(error){
       res.json({success: false, message: "Failed to delete Leave!" + error});
       }
    else{
      res.json({success: true, message: "Leave deleted successfully"});
    }
  })
  
});


// delete Leave Details
router.delete('/deleteLeaveDetailsByEmployeeId', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  
  // deleteLeave route
  LeaveDetails.deleteLeaveDetailsByEmployeeId(req.query.employeeId, (error)=>{
    if(error){
       res.json({success: false, message: "Failed to delete Leave Details!" + error});
       }
    else{
      res.json({success: true, message: "Leave Details deleted successfully"});
    }
  })
  
});

// make our router available globally
module.exports = router;