# Dockerfile
# Use an official Node runtime as the base image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source
COPY . .

# Make port 5173 available to the outside world
EXPOSE 5173

# Define environment variable
ENV PATH /app/node_modules/.bin:$PATH

CMD ["npx", "vite", "--host", "0.0.0.0"]