const {Dao} = require('../storage')

module.exports = class DataBaseVideoReading {
  constructor (videoFileId, output) {
    this.output = output
    this.videoFileId = videoFileId
    this.dao = new Dao()
  }

  async getLastBytePosition () {
    const size = await this.getSize ()
    return size - 1
  }

  async getSize () {
    const videoFile = await this.dao.getFileById(this.videoFileId)
    return videoFile.length
  }

  read (start, end) {
    this.dao.getVideoChunks(this.videoFileId, this.output, start, end)
  }

}