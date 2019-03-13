const assert = require('assert')
const {GridFSBucket} = require('mongodb')

const bucketName = 'videos'
const dbName = 'streaming'
const videosCollectionName = `${bucketName}.files`
const chunksCollectionName = `${bucketName}.chunks`

module.exports = class {

  constructor(dbconnection){
    this.dbconnection = dbconnection
  }

  save(videoReadStream, filename) {
    const db = this.dbconnection.db(dbName)

//    console.log(collection)
    const bucket =  new GridFSBucket(db, {
      chunkSizeBytes: 1024,
      bucketName: bucketName
    })

    const promise = videoReadStream.pipe(bucket.openUploadStream(filename))


      promise.on('error', function (error) {
        assert.ifError(error)
      }).on('finish', function () {
      console.log('done!')

    })
  }

}