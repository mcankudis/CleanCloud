# build client
FROM node:alpine AS development

WORKDIR /usr/src/app/client

COPY ./client /usr/src/app/client

RUN npm install

RUN npm run build

RUN ls

# build server
WORKDIR /usr/src/app/server

COPY ./server /usr/src/app/server

RUN ls

RUN npm install

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

EXPOSE 3545

CMD ["node", "dist/main.js"]