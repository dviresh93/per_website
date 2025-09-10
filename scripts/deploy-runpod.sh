#!/bin/bash

# RunPod Deployment Script for Viresh Portfolio
# This script helps deploy your portfolio to RunPod

set -e

echo "🚀 Deploying Viresh Portfolio to RunPod..."

# Configuration
IMAGE_NAME="viresh-portfolio"
CONTAINER_NAME="viresh-portfolio"
PORT="8080"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "Dockerfile" ]; then
    print_error "Dockerfile not found. Please run this script from the project root directory."
    exit 1
fi

print_status "Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully!"
else
    print_error "Failed to build Docker image."
    exit 1
fi

# Stop and remove existing container if it exists
print_status "Stopping existing container (if any)..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Run the container
print_status "Starting portfolio container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:8080 \
    --restart unless-stopped \
    $IMAGE_NAME

if [ $? -eq 0 ]; then
    print_success "Portfolio deployed successfully!"
    print_status "Your portfolio is now running on port $PORT"
    print_status "Access it at: http://localhost:$PORT"
    
    # Show container status
    print_status "Container status:"
    docker ps | grep $CONTAINER_NAME
    
    # Show logs
    print_status "Recent logs:"
    docker logs --tail 10 $CONTAINER_NAME
    
    echo ""
    print_success "🎉 Deployment complete!"
    print_status "To view logs: docker logs -f $CONTAINER_NAME"
    print_status "To stop: docker stop $CONTAINER_NAME"
    print_status "To restart: docker restart $CONTAINER_NAME"
    
else
    print_error "Failed to start container."
    exit 1
fi
