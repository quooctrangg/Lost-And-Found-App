# Use a specific Node.js version
FROM node:20 AS builder

# Set the working directory
WORKDIR /usr/src/client

# Copy only package.json and package-lock.json to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm i --only=production

# Copy the rest of the application code
COPY . .

# Expose port 3000 (assuming your Vue app runs on port 3000)
EXPOSE 3000

# Command to run the Vue application
CMD ["npm", "run", "serve"]