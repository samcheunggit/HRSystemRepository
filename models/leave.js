const mongoose = require('mongoose')
const moment = require('moment');
const generalUtils = require('../utils/generalUtils');

// Leave Schema
const LeaveSchema = mongoose.Schema({
  employeeid: {
    type: String,
    index: { unique: true }
  },
  employeename:{
    type: String
  },
  annualleave: {
    type: Number
  },
  sickleave: {
    type: Number
  },
  overtimeleave: {
    type: Number
  },
  healthleave: {
    type: Number
  },
  maternityleave: {
    type: Number
  },
  marriageleave: {
    type: Number
  },
  funeralleave: {
    type: Number
  },
  otherleave: {
    type: Number
  }
});
  
// first argument: collection name, second argument: schema
const Leave = module.exports = mongoose.model('leave', LeaveSchema)

// create leave and save it to mongodb
module.exports.createLeave = (defaultLeave, callback)=>{
  defaultLeave.save(callback);
}

// get leaves by employee id
module.exports.getLeavesByEmployeeId = (employeeId, callback)=>{
  const query = {employeeid: employeeId}
  Leave.findOne(query, callback);
}

// update employee name for leave
module.exports.updateEmployeeNameForLeave = (object, callback)=>{
  console.log("object test: ",object);
  const query = {employeeid: object.employeeId}
  Leave.update(query, {employeename: object.employeeName}, callback);
}

// save specific leaves
module.exports.saveLeave = (leave, callback)=>{
  let leaveTypeColumn = {}
  leaveTypeColumn[generalUtils.switchLeaveTypeColumn(leave.leaveType)]=leave.newRemainsDay;
  Leave.findByIdAndUpdate(leave.leaveId, { $set: leaveTypeColumn}, { new: true, upsert : false }, callback)
}

// save all leaves
module.exports.saveAllLeaves = (leaves, callback)=>{
  // option set new to true, return the modified document rather than the original. defaults to false (changed in 4.0)
  Leave.findByIdAndUpdate(leaves._id,  leaves, { new: true }, callback)
}

// get all leaves
module.exports.getAllLeaves = (callback)=>{
  Leave.find(callback);
}

// delete Leave and save it to mongodb
module.exports.deleteLeaveByEmployeeId = (employeeId, callback)=>{  
  Leave.find({employeeid: employeeId}).remove(callback);
}