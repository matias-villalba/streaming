const {usingDatabase} = require('../config')

module.exports.getAllVideos = usingDatabase?
  require('./dbSearch')
  :require('./filesystemSearch')