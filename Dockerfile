# This docker file can be called like this:
# docker run -v /path/to/images:/images [image-name] photo.jpg
# this will then output a JSON Object to stdout

# ────────────────────────────────────────────────────────────────────────────────
# Base Image
# ────────────────────────────────────────────────────────────────────────────────
FROM tensorflow/tensorflow:latest

# ────────────────────────────────────────────────────────────────────────────────
# Install base dependencies
# ────────────────────────────────────────────────────────────────────────────────
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN apt-get install -y wget curl

# Set pip up to allow for bearmetal installation
RUN python3 -m pip config set global.break-system-packages true
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

# ────────────────────────────────────────────────────────────────────────────────
# Install Node.js
# ────────────────────────────────────────────────────────────────────────────────
RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs

# ────────────────────────────────────────────────────────────────────────────────
# Install tool-specific dependencies
# ────────────────────────────────────────────────────────────────────────────────

# ────────────────────────────────────────────────────────────────────────────────
# Install ExifTool
# ────────────────────────────────────────────────────────────────────────────────
RUN apt-get install -y exiftool

# ────────────────────────────────────────────────────────────────────────────────
# Install ZBar
# ────────────────────────────────────────────────────────────────────────────────
RUN apt-get install -y zbar-tools

# ────────────────────────────────────────────────────────────────────────────────
# Install Face Detection Package
# ────────────────────────────────────────────────────────────────────────────────
RUN pip install tf-keras
RUN pip install retina-face

# Download the model for the face detection package
RUN wget https://github.com/serengil/deepface_models/releases/download/v1.0/retinaface.h5 -P /root/.deepface/weights/


ENV TF_CPP_MAX_VLOG_LEVEL=4

# ────────────────────────────────────────────────────────────────────────────────
# Set working directory
# ────────────────────────────────────────────────────────────────────────────────
WORKDIR /app

# ────────────────────────────────────────────────────────────────────────────────
# Copy package.json and install dependencies
# ────────────────────────────────────────────────────────────────────────────────
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
RUN npm install

# ────────────────────────────────────────────────────────────────────────────────
# Copy application code
# ────────────────────────────────────────────────────────────────────────────────
COPY src ./src

# ────────────────────────────────────────────────────────────────────────────────
# Compile TypeScript code
# ────────────────────────────────────────────────────────────────────────────────
RUN npx tsc

# ────────────────────────────────────────────────────────────────────────────────
# Set the entrypoint
# ────────────────────────────────────────────────────────────────────────────────
ENV PATH="/opt/venv/bin:$PATH"
# ENTRYPOINT ["node", "dist/main.js"]
ENTRYPOINT ["/bin/bash"]