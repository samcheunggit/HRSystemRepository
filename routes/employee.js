/* In order to secure a route, use passport.authenticate('jwt', {session: false}) */

// Create an express router
var router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const dbConfig = require('../config/database');
const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'hhn3yyryw', 
  api_key: '667391383193948', 
  api_secret: 'pr7k1hAvLVW6z33H-ZCxJX83evg' 
});

// Add New Employee
router.post('/addEmployee', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  // initialize new employee model object and bind all parameters from request body
  let newEmployee = new Employee(req.body);
  // add addEmployee route
  Employee.addEmployee(newEmployee, (error, callback)=>{
    if(error){
       res.json({success: false, message: "Failed to add employee!" + error});
       }
    else{
       res.json({success: true, message: "employee added successfully", employee: new Employee(callback)});
    }
  })
  
});

// Update Employee
router.put('/updateEmployee', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{

  let updatedEmployee = req.body;
  // updateEmployee route
  Employee.updateEmployee(updatedEmployee, (error, updatedEmployee)=>{
    if(error){
       res.json({success: false, message: "Failed to update employee!" + error});
       }
    else{
      res.json({success: true, message: "employee updated successfully", updatedEmployee: updatedEmployee});
    }
  })
  
});

// delete Employee
router.delete('/deleteEmployee', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  
  // deleteEmployee route
  Employee.deleteEmployee(req.query.employeeId, (error)=>{
    if(error){
       res.json({success: false, message: "Failed to delete employee!" + error});
       }
    else{
      res.json({success: true, message: "employee deleted successfully"});
    }
  })
  
});

// delete deleteEmployeeProfile
router.delete('/deleteEmployeeProfile', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  cloudinary.v2.uploader.destroy(req.query.imagePublicId, (error, result)=>{
    if(error){
      res.json({success: false, message: "Failed to delete image!" + error});
    }
    else{
      res.json({success: true, message: "image deleted successfully"});
    }
  });
});

// Get One Employee
router.get('/profile', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
    
  const employeeId = req.query.employeeId;
  
  Employee.getEmployeeById(employeeId, (error, employee)=>{
    if(error) throw error;
    
    res.json({success: true, message: "get employee successfully", employee: employee});
  });
});

// Get All Employees
router.get('/getAllEmployees', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  Employee.getAllEmployees((error, employees)=>{
    if(error) throw error;
    res.json({
                success: true,
                message: "get employees successfully",
                employees: employees
              });
  });
});

// make our router available globally
module.exports = router;