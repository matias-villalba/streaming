const {usingDatabase} = require('../config')
const VideoReading = usingDatabase?
  require ('./DataBaseVideoReading'):
  require ('./FileSystemVideoReading')

console.log(`Using ${VideoReading.name} implementation`)
module.exports.VideoReading = VideoReading