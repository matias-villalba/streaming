# Video streaming web app with html5, NodeJs and Mongodb
This is an example of a video streaming web application, there are two implementations as an example.
The first one uses the filesystem to store the video files, the second one uses Mongodb to store them.
You can choose which one to use, by environment variables setting or with one of the following running alternatives:


### Run with docker-compose
* Using mongodb database: 
```bash
docker-compose up --build
```
And open: http://localhost:9005/

(The streaming api-endpoint will be:
http://localhost:5000/videos/:videoName)

* Using the filesystem: 
```bash
docker-compose -f docker-compose-filesystem-config.yml up --build
```


### To run locally with gulp
* Using mongodb database (you will need to have a mongodb running ):
```bash
npm install
npm run server-with-db-and-client
```
* Using the filesystem:
```bash
npm run server-with-fs-and-client
```

* To run only streaming api using mongodb:
```bash
npm run server-with-db-storage
```
* Using the filesystem:
```bash
npm run server-with-fs-storage
```


### With Docker
If you want to build and run only the streaming server container:
```bash
docker build -t streaming .
```

Then run, for instance, with the filesystem config:
```bash
docker run -itd -e STORAGE_TYPE='filesystem' \
-e VIDEOS_DIRECTORY_PATH='./resources/' \
-e LISTENING_PORT='5000' \
-v $(pwd)/resources/the-big-bang-theory-opening.mp4:/app/resources/the-big-bang-theory-opening.mp4 \
-p 5000:5000 streaming
```