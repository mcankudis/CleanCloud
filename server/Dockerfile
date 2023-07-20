FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

COPY . .

EXPOSE 3545

CMD ["node", "dist/main.js"]