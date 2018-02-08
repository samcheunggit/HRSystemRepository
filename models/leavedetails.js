const mongoose = require('mongoose')
const moment = require('moment');

// Leave Details Schema
const LeaveDetailsSchema = mongoose.Schema({
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
  }
});
  
// first argument: collection name, second argument: schema
const LeaveDetails = module.exports = mongoose.model('leavedetails', LeaveDetailsSchema)

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