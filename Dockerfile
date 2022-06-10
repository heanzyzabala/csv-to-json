FROM node:16-alpine

ENV NODE_ENV production

RUN mkdir -p /usr/app && chown -R node:node /usr/app

WORKDIR /usr/app

USER node

COPY --chown=node:node ./dist package*.json ./

RUN npm i --production

EXPOSE 3000

CMD ["node", "index.js"]