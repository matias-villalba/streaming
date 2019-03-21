const {initialize} = require('./src/storage')
const express = require('express')
const bodyparser = require('body-parser')
const {VideoReading} = require('./src/reading')
const {videoWriter} = require('./src/writing')
const {getAllVideos} = require('./src/searching')
const {extractStartAndEndFromHeaders, retrieveStatusCode, HeadersBuilder} = require('./src/html5-video')
const app = express()
const multer  = require('multer')
const cors = require('cors')
const {listeningPort} = require('./src/config')

const upload = multer({ storage: multer.memoryStorage() })

async function startup(){
  try{
    await initialize()
    app.listen(listeningPort, function () {
      console.log('listening on port ' + listeningPort + '...');
    })

  }catch (error){
    process.exit(1)
  }
}
startup()

app.use(cors())
app.use(bodyparser.json({limit: '50mb'}))

app.get('/videos/:videoId', async (req, res) => {
  try{
    const videoReading = new VideoReading(req.params.videoId, res)
    const {start, end} = extractStartAndEndFromHeaders(req.headers, await videoReading.getLastBytePosition())
    videoReading.read(start, end)
    res.writeHead(retrieveStatusCode(req.headers), new HeadersBuilder().addStart(start)
                                                                       .addEnd(end)
                                                                       .addTotalVideoSize(await videoReading.getSize())
                                                                       .build())
  }catch(error){
    res.status(500).end()
  }
})

app.get('/videos', async (req, res) =>{
  try{
    const videos = await getAllVideos()
    res.status(200).send(videos)

  }catch(e){
    res.sendStatus(500)
  }

})

app.post('/videos', async (req, res) =>{
  try{
    const id = await videoWriter.writeFile(req.body.videoName)
    res.status(200).send({id})

  }catch(e){
    res.sendStatus(500)
  }

})

app.post('/videos/:videoId/chunks', upload.single('uploadedVideo'), async (req, res) =>{
  try {
    console.log(req.body);
    console.log(req.file);

    await videoWriter.writeChunk(req.params.videoId, req.file.buffer, parseInt(req.body.fileLength))
    res.sendStatus(200)

  }catch(e){
    res.sendStatus(500)
  }

})




