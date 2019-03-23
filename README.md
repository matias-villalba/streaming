# Streaming web app with html5, NodeJs and Mongodb
This is an example of a streaming web application, there are two implementations as example.
The first one is using the filesystem to store de video files, the second one is using mongodb to store the videos.
You can choose between each one alternatives setting environment variables or using next run alternatives:


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
If you want to build and run only the streaming sever container:
```bash
docker build -t streaming .
```

Later run with the filesystem config:
```bash
docker run -itd -e STORAGE_TYPE='filesystem' \
-e VIDEOS_DIRECTORY_PATH='./resources/' \
-e LISTENING_PORT='5000' \
-v $(pwd)/resources/the-big-bang-theory-opening.mp4:/app/resources/the-big-bang-theory-opening.mp4 \
-p 5000:5000 streaming
```