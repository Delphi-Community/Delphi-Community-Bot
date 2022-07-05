#https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16

# Default ENV
ENV CLIENTID=''
ENV GUILDID=''
ENV DC_TOKEN=''
ENV CHANNEL_ID_GETTING_STARTED=''
ENV MARKDOWN_URL=''

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

#RUN node ./src/deploy-commands.js

EXPOSE 8080
CMD [ "node", "src/index.js" ]