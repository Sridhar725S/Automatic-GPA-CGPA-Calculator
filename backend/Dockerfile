# Use the official Puppeteer image with Chrome
FROM ghcr.io/puppeteer/puppeteer:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install --unsafe-perm

# Copy the rest of the application code
COPY . .

# Expose the port your server will run on
EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
