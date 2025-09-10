#!/bin/bash

# DockerHub Deployment Script for Viresh Portfolio
# This script builds and pushes your portfolio to DockerHub

set -e

echo "🐳 Deploying Viresh Portfolio to DockerHub..."

# Configuration - UPDATE THESE VALUES
DOCKERHUB_USERNAME="your-dockerhub-username"  # Change this!
IMAGE_NAME="viresh-portfolio"
TAG="latest"

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

# Check if DockerHub username is set
if [ "$DOCKERHUB_USERNAME" = "your-dockerhub-username" ]; then
    print_error "Please update the DOCKERHUB_USERNAME variable in this script with your actual DockerHub username."
    exit 1
fi

# Check if user is logged in to DockerHub
if ! docker info | grep -q "Username:"; then
    print_warning "You're not logged in to DockerHub. Please run: docker login"
    read -p "Do you want to login now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker login
    else
        print_error "Please login to DockerHub first: docker login"
        exit 1
    fi
fi

# Build the image
print_status "Building Docker image..."
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully!"
else
    print_error "Failed to build Docker image."
    exit 1
fi

# Tag the image for DockerHub
print_status "Tagging image for DockerHub..."
docker tag $IMAGE_NAME $DOCKERHUB_USERNAME/$IMAGE_NAME:$TAG

# Push to DockerHub
print_status "Pushing to DockerHub..."
docker push $DOCKERHUB_USERNAME/$IMAGE_NAME:$TAG

if [ $? -eq 0 ]; then
    print_success "Image pushed to DockerHub successfully!"
    print_status "Your image is available at: https://hub.docker.com/r/$DOCKERHUB_USERNAME/$IMAGE_NAME"
    
    echo ""
    print_success "🎉 DockerHub deployment complete!"
    print_status "To run your image: docker run -p 8080:8080 $DOCKERHUB_USERNAME/$IMAGE_NAME:$TAG"
    print_status "To run on RunPod: Use the image $DOCKERHUB_USERNAME/$IMAGE_NAME:$TAG"
    
else
    print_error "Failed to push to DockerHub."
    exit 1
fi
