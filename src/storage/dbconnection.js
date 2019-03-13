const {MongoClient} = require('mongodb')
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'videos'

async function connect () {
  try{
    const dbConnectionPool = await MongoClient.connect(url, {poolSize: 10})
    return dbConnectionPool
  }catch (error){
    console.error('cont connect to mongodb', error.code)
    console.error('cont connect to mongodb', error)
    return error  //it will return a rejected promise
  }
}

module.exports = connect