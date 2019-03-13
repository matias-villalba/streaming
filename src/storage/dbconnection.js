const {MongoClient} = require('mongodb')
const url = 'mongodb://127.0.0.1:27017'

let dbConnection

module.exports.initializeConnection = async function connect () {
  try{
    const dbConnectionPool = await MongoClient.connect(url, {poolSize: 10, useNewUrlParser: true})
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