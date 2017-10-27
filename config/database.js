const mongodbUser = 'admin'
const mongodbPassword = 'adminpw'

var databaseConfig = {}

databaseConfig.url = `mongodb://${mongodbUser}:${mongodbPassword}@ds135234.mlab.com:35234/heroku_clg95rmg`
databaseConfig.secret = 'lfrnappJWTSecret'
databaseConfig.jwtOpts = {session: false}

module.exports = databaseConfig