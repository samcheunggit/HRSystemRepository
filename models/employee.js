const mongoose = require('mongoose')
const moment = require('moment');

// Employee Schema
const EmployeeSchema = mongoose.Schema({
//   employeeid: String,
  userid: {
    type: String
  },
  fullname: {
    type: String
  },
  birthday: {
    type: Date
  },
  gender: {
    type: String
  },
  telno: {
    type: Number
  },
  address: {
    type: String
  },
  profilepic: {
    type: String
  },
  title: {
    type: String
  },
  worktype: {
    type: String
  },
  dateofjoin: {
    type: Date
  },
  ecname: {
    type: String
  },
  ectelno: {
    type: Number
  },
  ecrelation: {
    type: String
  },
  isactive: {
    type: Boolean
  },
  leaveid: {
    type: String
  }
});

// first argument: collection name, second argument: schema
const Employee = module.exports = mongoose.model('employee', EmployeeSchema)
 
module.exports.getEmployeeById = (id, callback)=>{
  Employee.findById(id, callback);
}

// add employee and save it to mongodb
module.exports.addEmployee = (newEmployee, callback)=>{
  
  // generate id for new login user
  let objectId = new mongoose.mongo.ObjectId();
  newEmployee.userid = objectId;
  newEmployee.dateofjoin = moment(newEmployee.dateofjoin).format("MM/DD/YYYY");
  newEmployee.save(callback);
}

// update employee and save it to mongodb
module.exports.updateEmployee = (updatedEmployee, callback)=>{  
// option set new to true, return the modified document rather than the original. defaults to false (changed in 4.0)
  Employee.findByIdAndUpdate(updatedEmployee.id,  updatedEmployee, { new: true }, callback)
}

// delete employee and save it to mongodb
module.exports.deleteEmployee = (employeeId, callback)=>{  
  Employee.findByIdAndRemove(employeeId, callback)
}

// add employee and save it to mongodb
module.exports.getAllEmployees = (callback)=>{
  // exclude __v (version key) from mogoose because dataTable
  // cannot accept number without quote ("__v":0)
  Employee.find({}, callback).select('-__v');
}

