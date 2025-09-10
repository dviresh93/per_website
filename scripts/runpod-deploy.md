# RunPod Deployment Guide

## 🚀 Quick Deploy to RunPod

### Method 1: Using Docker Image (Recommended)

1. **Build and push to DockerHub:**
   ```bash
   # Update your DockerHub username in scripts/deploy-dockerhub.sh
   ./scripts/deploy-dockerhub.sh
   ```

2. **Deploy on RunPod:**
   - Go to [RunPod.io](https://runpod.io)
   - Create a new pod
   - Select "Docker Image" as template
   - Use your DockerHub image: `your-username/viresh-portfolio:latest`
   - Set port: `8080`
   - Deploy!

### Method 2: Direct Git Deployment

1. **Create RunPod Pod:**
   - Go to [RunPod.io](https://runpod.io)
   - Create new pod with "Ubuntu 20.04" template
   - Enable SSH access

2. **Connect and Deploy:**
   ```bash
   # SSH into your RunPod instance
   ssh root@your-runpod-ip
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Clone your repository
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   
   # Deploy using the script
   chmod +x scripts/deploy-runpod.sh
   ./scripts/deploy-runpod.sh
   ```

### Method 3: Using RunPod Templates

1. **Create Custom Template:**
   - Upload your project files to RunPod
   - Create a custom template with your portfolio
   - Use the template for future deployments

## 🔧 RunPod Configuration

### Environment Variables
```bash
NODE_ENV=production
PORT=8080
```

### Port Configuration
- **Container Port:** 8080
- **Public Port:** 8080 (or any available port)

### Resource Requirements
- **CPU:** 1 vCPU minimum
- **RAM:** 1GB minimum
- **Storage:** 2GB minimum

## 📋 RunPod Deployment Checklist

- [ ] Docker image built and tested locally
- [ ] DockerHub image pushed (if using Method 1)
- [ ] RunPod account created
- [ ] Pod configured with correct image/ports
- [ ] Environment variables set
- [ ] Health checks configured
- [ ] Custom domain configured (optional)

## �� Accessing Your Portfolio

After deployment, your portfolio will be available at:
- **RunPod URL:** `https://your-pod-id-8080.proxy.runpod.net`
- **Custom Domain:** If configured

## 🔄 Updates and Maintenance

### Updating Content
1. Edit JSON files in `data/` folder
2. Rebuild and push Docker image
3. Restart RunPod pod

### Monitoring
- Check RunPod dashboard for pod status
- Monitor logs: `docker logs viresh-portfolio`
- Set up health checks

## 🆘 Troubleshooting

### Common Issues

**Port not accessible:**
- Check RunPod port configuration
- Verify container is running: `docker ps`
- Check logs: `docker logs viresh-portfolio`

**Container won't start:**
- Check Docker image exists
- Verify Dockerfile syntax
- Check resource limits

**Content not updating:**
- Rebuild Docker image after changes
- Clear browser cache
- Restart container

### Support
- RunPod Documentation: https://docs.runpod.io
- Docker Documentation: https://docs.docker.com
- Portfolio Issues: Check GitHub repository
