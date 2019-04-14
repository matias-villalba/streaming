const {Readable} = require('stream')
const {Dao} = require('../storage')
const {databaseChunkSizeBytes} = require('../config')

module.exports.writeFile = async (fileName) => {
    const readableStream = new Readable()
    readableStream.push(null)
    const dao = Dao.getInstance()
    return await dao.saveFile(fileName, readableStream)
  }

  const updateUncompletedChunkAndWriteNext = async (lastChunkInDb, chunkDataBuffer, videoId) => {
    const dao = Dao.getInstance()
    const secondPartBuffer = chunkDataBuffer.slice(0, databaseChunkSizeBytes - lastChunkInDb.data.length())
    const updatedChunkBuffer = Buffer.concat([lastChunkInDb.data.buffer, secondPartBuffer])
    const bufferStart = databaseChunkSizeBytes - lastChunkInDb.data.length()
    await dao.updateFileChunk(lastChunkInDb , updatedChunkBuffer)

    const remainingBufferData = chunkDataBuffer.slice(bufferStart)

    let {lastChunkNumber, lastChunkSize} = await writeSlicingChunks(lastChunkInDb, remainingBufferData, videoId)
    lastChunkSize = lastChunkSize !== undefined? lastChunkSize : updatedChunkBuffer.length

    return {lastChunkNumber, lastChunkSize}
  }

function isTheLastChunkOfFile (file, lastChunkNumber, lastChunkSize, fileLength) {
  return ((file.chunkSize * (lastChunkNumber + 1) + lastChunkSize - file.chunkSize ) === fileLength )
}
module.exports.writeChunk = async (videoId, chunkDataBuffer, fileLength) => {
    const dao = Dao.getInstance()
    const lastChunkInDb = await dao.getLastChunkByFileId (videoId)

    const {lastChunkNumber, lastChunkSize} = (lastChunkInDb && lastChunkInDb.data.length() < databaseChunkSizeBytes)?
                                            await updateUncompletedChunkAndWriteNext(lastChunkInDb, chunkDataBuffer, videoId)
                                            :await writeSlicingChunks(lastChunkInDb, chunkDataBuffer, videoId)

    return isTheLastChunkOfFile(await dao.getFileById(videoId), lastChunkNumber, lastChunkSize, fileLength)?
                await dao.updateFileLength(videoId, fileLength )
                :lastChunkNumber
  }

  const writeSlicingChunks = async (lastChunkInDb, chunkDataBuffer, files_id) =>{
    const dao = Dao.getInstance()

    let n = lastChunkInDb? lastChunkInDb.n+1 : 0
    let data
    let startIndex = 0
    while(startIndex < chunkDataBuffer.length){
      let end = (startIndex+databaseChunkSizeBytes) < chunkDataBuffer.length? startIndex+databaseChunkSizeBytes : chunkDataBuffer.length
      data = chunkDataBuffer.slice(startIndex, end)
      n = (await dao.saveFileChunk({files_id, n, data}))+1
      startIndex = end
    }

    const lastChunkNumber = n > 0? n-1 : 0
    return data?
                {lastChunkNumber, lastChunkSize:data.length}
              : {lastChunkNumber}

  }
