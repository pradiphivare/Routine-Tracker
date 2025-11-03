# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all backend source code
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
