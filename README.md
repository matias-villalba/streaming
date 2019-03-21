
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
docker run -it -p 5000:5000 streaming


The html page where you can see the video will be:
http://localhost:9005/

The streaming api-endpoint will be:
http://localhost:5000/videos/:videoName