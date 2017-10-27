/* In order to secure a route, use passport.authenticate('jwt', {session: false}) */

// Create an express router
var router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const dbConfig = require('../config/database');

// Add Employee
router.post('/add', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
  // initialize new employee model object and bind all parameters from request body
  let newEmployee = new Employee(req.body);
  
  // add addEmployee route
  Employee.addEmployee(newEmployee, (error, employee)=>{
    if(error){
       res.json({success: false, message: "Failed to add employee!" + error});
       }
    else{
      res.json({success: true, message: "employee added successfully"});
    }
  })
  
});

router.get('/profile', passport.authenticate('jwt', dbConfig.jwtOpts), (req, res, next)=>{
    
  const employeeId = req.query.employeeId;
  
  Employee.getEmployeeById(employeeId, (error, employee)=>{
    if(error) throw error;
    
    res.json({
                success: true,
                message: "get employee successfully",
                employee: employee
              });
  });
});

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