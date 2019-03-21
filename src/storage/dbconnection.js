const {MongoClient} = require('mongodb')
const {databaseUrl} =  require('../config')

let dbConnection

module.exports.initializeConnection = async function connect () {
  try{
    console.log(`connecting to: ${databaseUrl}`)
    const dbConnectionPool = await MongoClient.connect(databaseUrl, {poolSize: 10, useNewUrlParser: true})
    dbConnection = dbConnectionPool
    return dbConnectionPool
  }catch (error){
    console.error('cant connect to mongodb', error.code)
    console.error('cant connect to mongodb', error)
    return Promise.reject(error)  //it will return a rejected promise
  }
}


module.exports.getConnection = function(){
  if(!dbConnection){
    console.error('db connection is not initialized')
  }
  return dbConnection
}