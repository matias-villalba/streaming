const fs = require('fs')
const {videosDirectoryPath} = require('../config')

module.exports = class FileSystemVideoReading{
  constructor (videFilePath, output){
    this.output = output
    this.videFilePath = `${videosDirectoryPath}${videFilePath}`
    this.fileStat = fs.statSync(this.videFilePath)
  }

  getLastBytePosition(){
    return this.fileStat.size-1
  }
  getSize(){
    return this.fileStat.size
  }

  read(start, end){
    const fileReadStream = start != undefined && end != undefined?
                              fs.createReadStream(this.videFilePath, {start, end})
                             : fs.createReadStream(this.videFilePath)
    fileReadStream.pipe(this.output)
  }

}