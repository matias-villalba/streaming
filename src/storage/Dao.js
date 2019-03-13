const assert = require('assert')
const {GridFSBucket} = require('mongodb')

const bucketName = 'videos'
const dbName = 'streaming'
const videosCollectionName = `${bucketName}.files`
const chunksCollectionName = `${bucketName}.chunks`

const {getConnection} = require('./dbconnection')

module.exports = class Dao{

  constructor () {
    this.db = getConnection().db(dbName)
    this.bucket = new GridFSBucket(this.db, {
      chunkSizeBytes: 1024,
      bucketName: bucketName
    })

  }

  save (videoReadStream, filename) {
    videoReadStream.pipe(this.bucket.openUploadStream(filename))
      .on('error', function (error) {
        console.error('error writing video', error)
        assert.ifError(error)
      }).on('finish', function () {
      console.log('done!')

    })
  }

  getVideoChunks (filename, outputStream, start, end) {
    const gridFSBucketReadStream = this.bucket.openDownloadStreamByName(filename)
    if (start != undefined && end != undefined) {
      gridFSBucketReadStream.start(start)
        .end(end)
    }
    gridFSBucketReadStream.pipe(outputStream)
      .on('error', function (error) {
        console.error('error reading video', error)
        assert.ifError(error)
      })
      .on('end', function () {
        console.log('done!')
      })

  }

  getVideoFileSize(fileName){
    return new Promise((resolve, reject)=>{
      this.db.collection(videosCollectionName)
           .findOne( { "filename": fileName }, {projection: {length: 1, _id: 0}},(err, objWithLength)=>{
             if(err){
               reject(err)
               return
             }
             if(objWithLength === undefined){
               reject(new Error(`filename: ${fileName} not found`))
             }
             resolve(objWithLength.length)
           })
    })

  }

}