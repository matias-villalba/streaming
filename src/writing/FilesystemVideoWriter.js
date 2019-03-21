const {videosDirectoryPath} = require('../config')
const fs = require('fs')
const util = require('util')
const open = util.promisify(fs.open)
const appendFile = util.promisify(fs.appendFile)
const close = util.promisify(fs.close)


module.exports.writeFile = async (fileName) => {
  const fileNameToUse = await getValidFileName(fileName)
  await writeBufferOnFile(`${videosDirectoryPath}${fileNameToUse}`, Buffer.alloc(0), true)
  return fileNameToUse
}

module.exports.writeChunk = async (fileName, chunkDataBuffer, fileLength) => {
  return await writeBufferOnFile(`${videosDirectoryPath}${fileName}`, chunkDataBuffer, false)
}

const writeBufferOnFile = async (filePath, buffer, shouldCreate) => {
  let fileHandle
  try{

    fileHandle = await open(filePath, shouldCreate?'w':'a')
    return await appendFile(fileHandle, buffer)

  } finally {
    if (fileHandle !== undefined){
      await close(fileHandle);
    }
  }
}


const createNewFileName = (fileName, postfix)=>{
  const fileNameParts = fileName.split('.')
  return fileNameParts.length > 1? fileName.slice(0, -1-(fileNameParts[fileNameParts.length-1]).length )+`_${postfix}.`+fileNameParts[fileNameParts.length-1] : fileName+`_${postfix}`
}

const getValidFileName = async (fileName, postfix, fileNameWithoutPostfix) => {
  if(postfix && postfix > 50){ //an arbitrary limit
    throw new Error('cannot create a validFileName after 50 attempts')
  }
  if(!postfix){
    fileNameWithoutPostfix = fileName
  }

  if(!(await existsFile(fileName))){
    return fileName
  }
  const newPostFix = postfix? postfix+1 : 1

  return await getValidFileName(createNewFileName(fileNameWithoutPostfix, newPostFix), newPostFix, fileNameWithoutPostfix)
}


const existsFile = (fileName) =>{
  return new Promise((resolve, reject)=>{
    fs.access(`${videosDirectoryPath}${fileName}`, fs.constants.F_OK , (err)=>{
      err? resolve(false) : resolve(true)
    })

  })
}