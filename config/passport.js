const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LoginUser = require('../models/loginUser');
const dbConfig = require('../config/database');


module.exports = (passport)=>{
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = dbConfig.secret;

// new JwtStrategy(options, verify)
// verify is a function with the parameters verify(jwt_payload, done)
// - jwt_payload is an object literal containing the decoded JWT payload.
// - done is a passport error first callback accepting arguments done(error, user, info)
passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    LoginUser.getLoginUserById(jwt_payload.id, (err, loginUser)=> {
        if (err) {
            console.log("Error in get login user");
            return done(err, false);
        }
        if (loginUser) {
            console.log("Logged in user: "+loginUser.username);
            return done(null, loginUser);
        } else {
            console.log("No User found by this id: "+jwt_payload.id);
            return done(null, false);
            // or you could create a new account 
        }
    });
}));
}


