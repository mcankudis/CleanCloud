FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

COPY . .

EXPOSE 8080

CMD ["node", "dist/main.js"]