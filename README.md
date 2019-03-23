
Run locally with gulp:
npm install
npm run server-client
|
npm run server-with-db-and-client
|
npm run server-with-fs-and-client
|


Or

Run with docker-compose:
docker-compose up --build

Or if you want to run only streaming sever's container:
docker build -t streaming .

Run with filesystem config:
docker run -itd -e STORAGE_TYPE='filesystem' \
-e VIDEOS_DIRECTORY_PATH='./resources/' \
-e LISTENING_PORT='5000' \
-v $(pwd)/resources/the-big-bang-theory-opening.mp4:/app/resources/the-big-bang-theory-opening.mp4 \
-p 5000:5000 streaming



The html page where you can see the video will be:
http://localhost:9005/

The streaming api-endpoint will be:
http://localhost:5000/videos/:videoName