FROM node:latest

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8005

CMD [ "npm", "run", "watch" ]
