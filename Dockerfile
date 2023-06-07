FROM node:19.8.1-alpine

COPY . .

ARG IFANDONLYIF_DISCORD_BOT_BUILD_ARGS=empty
RUN echo $IFANDONLYIF_DISCORD_BOT_BUILD_ARGS | base64 -d > .env

RUN npm install

CMD ["node", "src/main.js"]