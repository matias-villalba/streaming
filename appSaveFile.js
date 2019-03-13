const fs = require('fs')
const {initializeConnection} = require('./src/storage/dbconnection')
const Dao = require('./src/storage/Dao')


async function initialize(){
  try{
    await initializeConnection()
    const dao = new Dao()

    const videoReadStream = fs.createReadStream('./resources/the-big-bang-theory-opening.mp4')
    dao.save(videoReadStream, 'the-big-bang-theory-opening.mp4')

  }catch (error){
    process.exit(1)
  }
}

initialize()


