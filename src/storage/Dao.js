const assert = require('assert')
const {GridFSBucket, ObjectID, Binary} = require('mongodb')

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

  saveFile (filename, videoReadStream) {
    return new Promise((resolve, reject)=>{
      const uploadStream = this.bucket.openUploadStream(filename)
      videoReadStream.pipe(uploadStream)
        .on('error', (error) => {
          console.error('error writing video', error)
          reject(error)
        }).on('finish', () => {
          console.log('file saved')
          resolve(uploadStream.id.toString())
      })
    })
  }

  updateFileLength (fileId, newFileLength) {
    const fileCollection = this.db.collection(videosCollectionName)
    return new Promise((resolve, reject)=>{
      fileCollection.updateOne({ "_id": new ObjectID(fileId) }, {$set: { 'length':newFileLength }}, (err)=>{
          (err)?
            reject(err)
            :resolve(fileId)
        })
    })
  }


  getLastChunkByFileId (fileId) {
    const chunksCollection = this.db.collection(chunksCollectionName)
    return new Promise((resolve, reject)=>{
      chunksCollection.findOne( { 'files_id': new ObjectID(fileId) }, {sort: {n: -1}, projection: {n: 1, _id: 0}},(err, lastChunk)=>{
        err?
          reject(err)
          :resolve(lastChunk)
      })
    })
  }

  saveFileChunk (chunkToInsert) {
    const chunksCollection = this.db.collection(chunksCollectionName)
    return new Promise((resolve, reject)=>{
      chunkToInsert.data = new Binary(chunkToInsert.data)
      chunkToInsert.files_id = new ObjectID(chunkToInsert.files_id)
        chunksCollection.insertOne(chunkToInsert, (err, ins)=>{
          try{
            err?
              reject(err)
              :resolve(ins.ops[0].n)
          }catch(e){
            reject(e)
          }
        })
      })
  }


  getVideoChunks (fileId, outputStream, start, end) {
    return new Promise((resolve, reject)=> {
      try{
        const gridFSBucketReadStream = this.bucket.openDownloadStream(new ObjectID(fileId))
        if (start != undefined && end != undefined) {
          gridFSBucketReadStream.start(start)
            .end(end)
        }
        gridFSBucketReadStream.pipe(outputStream)
          .on('error',  (error) => {
            console.error('error reading video', error)
            reject(error)
          })
          .on('end', () => {
            console.log('done!')
            resolve()
          })
      }catch (e){
        reject(e)
      }
    })

  }

  getFileById(fileId){
    return new Promise((resolve, reject)=> {
      this.db.collection(videosCollectionName)
        .findOne({"_id": new ObjectID(fileId)}, (err, file) => {
          try {
            (err || !file)?
              reject(err? err : new Error(`fileId: ${fileId} not found`))
              :resolve(file)
          }catch(e){
            reject(e)
          }
        })

    })

  }

  getAllFiles(){
    return new Promise((resolve, reject)=> {
      this.db.collection(videosCollectionName)
        .find({length:{$gt:0}})
        .map(file=>{
          file.id = file._id.toString()
          delete file['_id']
          return file
        })
        .toArray( (err, files) => {
          try {
            (err)?
              reject(err)
              :resolve(files)
          }catch(e){
            reject(e)
          }
        })

    })

  }

}