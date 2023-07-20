FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . .

RUN npm run build

COPY . .

FROM nginx

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html
