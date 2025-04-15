FROM node:20-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "sh", "-c", "npx prisma migrate dev && npm run start:dev" ]