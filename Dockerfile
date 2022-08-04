FROM node:16.13.1 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16.13.1 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG BLOB_CONNECTION_STRING=''
ENV BLOB_CONNECTION_STRING=${BLOB_CONNECTION_STRING}

ARG MONGO_CONNECTION_STRING=''
ENV MONGO_CONNECTION_STRING=${MONGO_CONNECTION_STRING}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]