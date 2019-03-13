const fs = require('fs')
const dbconnection = require('./src/storage/dbconnection')
const Dao = require('./src/storage/Dao')


async function initialize(){
  try{
    const db =  await dbconnection()
    const dao = new Dao(db)

    const videoReadStream = fs.createReadStream('./resources/the-big-bang-theory-opening.mp4')
    dao.save(videoReadStream, 'the-big-bang-theory-opening.mp4')

  }catch (error){
    process.exit(1)
  }
}

initialize()


