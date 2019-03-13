module.exports.Dao = require ('./Dao')

module.exports.initialize = ((process.env.STORAGE_TYPE || 'filesystem') === 'database')?
   require ('./dbconnection').initializeConnection:
   function nullFunction(){ Promise.resolve()}