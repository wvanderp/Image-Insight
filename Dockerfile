# This docker file can be called like this:
# docker run -v /path/to/images:/images [image-name] photo.jpg
# this will then output a JSON Object to stdout

FROM ubuntu:latest

# Install base dependencies
RUN apt-get update && apt-get install -y nodejs npm 

# Install tool-specific dependencies
# ExifTool
RUN apt-get install -y exiftool

# ZBar
RUN apt-get install -y zbar-tools

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
RUN npm install

# Copy application code
COPY src ./src

# Compile TypeScript code
RUN npx tsc

# Set the entrypoint
ENV PATH="/opt/venv/bin:$PATH"
ENTRYPOINT ["node", "dist/main.js"]
