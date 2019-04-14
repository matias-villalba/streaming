const Dao = require('../storage/Dao')

module.exports = async function getAllVideos() {
  const dao = Dao.getInstance()
  return await dao.getAllFiles()
}
