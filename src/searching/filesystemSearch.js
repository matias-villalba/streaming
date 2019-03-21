const {videosDirectoryPath} = require('../config')
const path = require('path')
const glob = require("glob-promise")

module.exports = async function getAllVideos() {
  return (await glob( `${videosDirectoryPath}*.mp4`))
          .map(filePath => {return {id:path.basename(filePath)}})
}

