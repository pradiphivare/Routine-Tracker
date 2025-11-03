FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy all backend source code
COPY backend/ ./

EXPOSE 3000
CMD ["npm", "start"]
