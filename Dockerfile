
FROM node:20-alpine

WORKDIR /app

COPY package* .

RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD [ "npm","start" ]