# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first for dependency caching
COPY ./backend/package*.json ./

RUN npm install --production

# Copy all source code
COPY ./backend .

EXPOSE 5000

CMD ["node", "src/index.js"]
