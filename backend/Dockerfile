# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY ./backend/package*.json ./
RUN npm install --production

# Copy all backend source code
COPY ./backend .

EXPOSE 3000
CMD ["npm", "start"]
# --- IGNORE ---