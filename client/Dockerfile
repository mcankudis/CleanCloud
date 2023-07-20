FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

COPY . .

FROM nginx

COPY  ./dist ./usr/share/nginx/html