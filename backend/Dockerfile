# Use Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all source code
COPY . .

# Expose API port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]
