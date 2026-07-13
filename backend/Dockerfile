FROM node:26-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm i
COPY . .

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]