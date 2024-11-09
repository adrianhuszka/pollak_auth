FROM node:22.11.0-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node /home/node/app

USER node

RUN npm install

ENV NODE_ENV=production

COPY --chown=node:node . .

RUN npx prisma generate
RUN npm ci --only=production

EXPOSE 3300

CMD [ "node", "index.js" ]