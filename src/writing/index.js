const VideoReading = ((process.env.STORAGE_TYPE || 'filesystem') === 'database')?
  require ('./DataBaseVideoReading'):
  require ('./FileSystemVideoReading')

console.log(`Using ${VideoReading.name} implementation`)
module.exports.VideoReading = VideoReading


module.exports.videoWriter = require ('./DataBaseVideoWriter')