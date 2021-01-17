FROM node:12-alpine

WORKDIR /app

ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE 3000

COPY package*.json .

RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "start"]