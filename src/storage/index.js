const {usingDatabase} = require('../config')
module.exports.Dao = require ('./Dao')

module.exports.initialize = usingDatabase?
   require ('./dbconnection').initializeConnection:
   function nullFunction(){ Promise.resolve()}