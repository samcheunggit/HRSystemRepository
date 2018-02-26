const mongoose = require('mongoose')
const moment = require('moment');

// Leave Details Schema
const PendingLeavesSchema = mongoose.Schema({
  employeeid: {
    type: String,
    required: true
  },
  leaveid: {
    type: String,
    required: true
  },
  leavetype: {
    type: String,
    required: true
  },
  leavefrom: {
    type: Date,
    required: true
  },
  leaveto: {
    type: Date,
    required: true
  },
  remarks: {
    type: String
  },
  applyDays: {
    type: Number
  }
});
  
// first argument: collection name, second argument: schema
const LeaveDetails = module.exports = mongoose.model('pendingleaves', PendingLeavesSchema)

// save leaves
module.exports.saveLeaveDetails = (leaveDetails, callback)=>{
  leaveDetails.save(callback);
}

// get leave details by employee id
module.exports.getLeaveDetailsByEmployeeId = (employeeId, callback)=>{
  const query = {employeeid: employeeId}
  LeaveDetails.find(query, callback);
}

// delete Leave details and save it to mongodb
module.exports.deleteLeaveDetailsByEmployeeId = (employeeId, callback)=>{  
  LeaveDetails.find({employeeid: employeeId}).remove(callback);
}