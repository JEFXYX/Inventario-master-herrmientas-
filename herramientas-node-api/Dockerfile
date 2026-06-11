FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --production

COPY . .

EXPOSE 4005

CMD ["bun", "server.js"]
