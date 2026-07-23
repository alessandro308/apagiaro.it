#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t my-jekyll-site .

# Remove any existing container
echo "Removing old container..."
docker rm -f test-site || true

# Run the container. Host port is overridable: PORT=4567 ./test.sh
# (8080 collides with CloudBeaver on this machine)
PORT="${PORT:-4567}"
echo "Running new container on host port ${PORT}..."
docker run -d -p "${PORT}:8080" --name test-site my-jekyll-site \
  bundle exec jekyll serve --host 0.0.0.0 --port 8080 --config _config.yml,_config_dev.yml

# Wait for the server to start (adjust sleep time if needed)
echo "Waiting for server to start..."
sleep 5

# Open the browser
echo "Opening browser..."
open "http://localhost:${PORT}"
