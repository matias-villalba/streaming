FROM node:10.15.3
RUN mkdir /app
WORKDIR /app
COPY package.json /app/
COPY app.js /app/
COPY src /app/src
COPY resources /app/resources
RUN npm i
EXPOSE 5000
CMD ["npm", "run", "server"]
