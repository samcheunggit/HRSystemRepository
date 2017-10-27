const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// const config = require('../config/database')

// loginUser Schema
const loginUserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdate: {
    type: Date
  },
  isactive: {
    type: Boolean
  },
  employeeid: {
    type: String
  },
  usertype: {
    type: String
  }
})

// first argument: collection name, second argument: schema
const LoginUser = module.exports = mongoose.model('loginuser', loginUserSchema)
 
module.exports.getLoginUserById = (id, callback)=>{
  LoginUser.findById(id, callback);
}

module.exports.getLoginUserByUserName = (username, callback)=>{
  const query = {username: username}
  LoginUser.findOne(query, callback);
}

// add user and save it to mongodb
module.exports.addLoginUser = (newLoginUser, callback)=>{

  // generate salt for 10 rounds
  bcrypt.genSalt(10, (error, salt) => {
    // hash on separate function calls
    bcrypt.hash(newLoginUser.password, salt, (error, hash)=>{
      if(error) throw error;
      // store hashed password and save it in mongodb
      newLoginUser.password = hash;
      newLoginUser.save(callback);
    });
  });
}

module.exports.passwordValidation = (inputPassword, storedPassword, callback)=>{
  // if comparison correct, then result will be repsoned in isMatch as true, otherwise it will be false
  bcrypt.compare(inputPassword, storedPassword, (error, isMatch)=>{
    if(error) throw error;
    // if no error thrown, return callback as defined in route, (error, isMatch)
    callback(null, isMatch);
  })
}
