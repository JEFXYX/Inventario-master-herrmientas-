FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 4005

CMD ["node", "server.js"]
