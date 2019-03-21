FROM node:10.15.3
RUN mkdir /app
WORKDIR /app
COPY package.json /app/
COPY app.js /app/
COPY src /app/src
COPY resources /app/resources
RUN npm i
EXPOSE 5000
ENV STORAGE_TYPE=database
ENV DATABASE_URL=mongodb://172.17.0.1:27017
ENV LISTENING_PORT=5000
CMD ["node", "app.js"]
