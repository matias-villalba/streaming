const Dao = require('../storage/Dao')

module.exports = async function getAllVideos() {
  const dao = new Dao()
  return await dao.getAllFiles()
}
