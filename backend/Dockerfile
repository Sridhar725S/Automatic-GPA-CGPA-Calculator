# Use the official Puppeteer Docker image
FROM ghcr.io/puppeteer/puppeteer:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start dbus (optional if needed)
RUN sudo service dbus start

# Expose the port your server runs on
EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
