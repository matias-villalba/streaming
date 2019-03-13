const {MongoClient} = require('mongodb')
const url = 'mongodb://127.0.0.1:27017'

let dbConnection

module.exports.initializeConnection = async function connect () {
  try{
    const dbConnectionPool = await MongoClient.connect(url, {poolSize: 10})
    dbConnection = dbConnectionPool
    return dbConnectionPool
  }catch (error){
    console.error('cont connect to mongodb', error.code)
    console.error('cont connect to mongodb', error)
    return error  //it will return a rejected promise
  }
}


module.exports.getConnection = function(){
  if(!dbConnection){
    console.error('db connection is not initialized')
  }
  return dbConnection
}