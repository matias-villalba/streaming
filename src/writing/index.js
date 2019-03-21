const {usingDatabase} = require('../config')

module.exports.videoWriter = usingDatabase?
  require ('./DataBaseVideoWriter')
  :require ('./FilesystemVideoWriter')