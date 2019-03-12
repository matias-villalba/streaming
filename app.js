const express = require('express')
const bodyparser = require('body-parser')
const {VideoReading} = require('./src/video-reading')
const {extractStartAndEndFromHeaders, retrieveStatusCode, HeadersBuilder} = require('./src/html5-video')
const app = express()
const port = 5000
app.use(bodyparser.json({limit: '50mb'}))

app.listen(port, function () {
  console.log('listening on port ' + port + '...');
})


app.get('/videos/:videoName', (req, res) => {
  const videoReading = new VideoReading(req.params.videoName, res)
  const {start, end} = extractStartAndEndFromHeaders(req.headers, videoReading.getLastBytePosition())
  videoReading.read(start, end)
  res.writeHead(retrieveStatusCode(req.headers), new HeadersBuilder().addStart(start)
                                                                     .addEnd(end)
                                                                     .addTotalVideoSize(videoReading.getSize())
                                                                     .build())
})


