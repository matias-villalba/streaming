const {initialize} = require('./src/storage')
const express = require('express')
const bodyparser = require('body-parser')
const VideoReading = require('./src/video-reading')
const {extractStartAndEndFromHeaders, retrieveStatusCode, HeadersBuilder} = require('./src/html5-video')
const app = express()
const port = 5000

async function startup(){
  try{
    await initialize()
    app.listen(port, function () {
      console.log('listening on port ' + port + '...');
    })

  }catch (error){
    process.exit(1)
  }
}
startup()

app.use(bodyparser.json({limit: '50mb'}))
app.get('/videos/:videoName', async (req, res) => {
  try{
    const videoReading = new VideoReading(req.params.videoName, res)
    const {start, end} = extractStartAndEndFromHeaders(req.headers, await videoReading.getLastBytePosition())
    videoReading.read(start, end)
    res.writeHead(retrieveStatusCode(req.headers), new HeadersBuilder().addStart(start)
                                                                       .addEnd(end)
                                                                       .addTotalVideoSize(await videoReading.getSize())
                                                                       .build())
  }catch(error){
    res.sendStatus(500)
  }
})


