const {Readable} = require('stream')
const {Dao} = require('../storage')

module.exports.writeFile = async (fileName) => {
    const readableStream = new Readable()
    readableStream.push(null)
    const dao = new Dao()
    return await dao.saveFile(fileName, readableStream)
  }

module.exports.writeChunk = async (videoId, chunkDataBuffer, fileLength) => {
    const dao = new Dao()
    const lastChunkInDb = await dao.getLastChunkByFileId (videoId)
    const n = !lastChunkInDb? 0 : lastChunkInDb.n +1
    const files_id = videoId
    const data = chunkDataBuffer
    const lastChunkNumber = await dao.saveFileChunk({files_id, n, data})
    const file = await dao.getFileById(videoId)
    const lastChunkSize = chunkDataBuffer.length
    return ((file.chunkSize * (lastChunkNumber+1) + lastChunkSize - file.chunkSize ) === fileLength )?
                await dao.updateFileLength(videoId, fileLength )
                :lastChunkNumber
  }

