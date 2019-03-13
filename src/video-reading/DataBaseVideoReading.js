const Dao = require('../storage/Dao')

module.exports = class FileSystemVideoReading {
  constructor (videoFileName, output) {
    this.output = output
    this.videoFileName = videoFileName
    this.dao = new Dao()
  }

  async getLastBytePosition () {
    const size = await this.getSize ()
    return size - 1
  }

  getSize () {
    return this.dao.getVideoFileSize(this.videoFileName)
  }

  read (start, end) {
    this.dao.getVideoChunks(this.videoFileName, this.output, start, end)
  }

}