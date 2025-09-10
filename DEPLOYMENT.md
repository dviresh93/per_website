# 🚀 Deployment Guide - Viresh Portfolio

This guide covers multiple deployment options for your portfolio website, with special focus on **RunPod** deployment.

## 📋 Quick Start

### Option 1: RunPod (Recommended for AI/ML Community)
```bash
# 1. Build and push to DockerHub
./scripts/deploy-dockerhub.sh

# 2. Deploy on RunPod
# - Go to runpod.io
# - Create pod with your DockerHub image
# - Set port 8080
# - Deploy!
```

### Option 2: Local Docker
```bash
# Build and run locally
docker build -t viresh-portfolio .
docker run -p 8080:8080 viresh-portfolio

# Or use docker-compose
docker-compose up -d
```

### Option 3: Traditional Hosting
```bash
# Just upload files to any web server
# No build process needed - it's a static site!
```

## 🐳 Docker Deployment

### Prerequisites
- Docker installed
- DockerHub account (for cloud deployment)

### Local Development
```bash
# Start development server
npm run dev

# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Use docker-compose
npm run docker:compose
```

### Production Deployment
```bash
# Build optimized image
docker build -t viresh-portfolio .

# Run with production settings
docker run -d \
  --name viresh-portfolio \
  -p 8080:8080 \
  --restart unless-stopped \
  viresh-portfolio
```

## 🌐 RunPod Deployment

### Why RunPod?
- **AI/ML Community**: Perfect for your robotics-to-AI journey
- **GPU Access**: If you want to add ML demos later
- **Cost Effective**: Pay only for what you use
- **Easy Scaling**: Scale up/down as needed

### Step-by-Step RunPod Deployment

#### Method 1: Docker Image (Easiest)

1. **Prepare Your Image:**
   ```bash
   # Update DockerHub username in scripts/deploy-dockerhub.sh
   nano scripts/deploy-dockerhub.sh
   
   # Build and push
   ./scripts/deploy-dockerhub.sh
   ```

2. **Deploy on RunPod:**
   - Go to [runpod.io](https://runpod.io)
   - Click "Deploy"
   - Select "Docker Image"
   - Enter: `your-username/viresh-portfolio:latest`
   - Set port: `8080`
   - Deploy!

#### Method 2: Git Repository

1. **Create RunPod Pod:**
   - Select "Ubuntu 20.04" template
   - Enable SSH access
   - Deploy pod

2. **Deploy via SSH:**
   ```bash
   # SSH into your pod
   ssh root@your-pod-ip
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Clone and deploy
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   chmod +x scripts/deploy-runpod.sh
   ./scripts/deploy-runpod.sh
   ```

### RunPod Configuration

**Recommended Settings:**
- **Template**: Docker Image or Ubuntu 20.04
- **GPU**: None (unless adding ML demos)
- **CPU**: 1-2 vCPUs
- **RAM**: 2-4GB
- **Storage**: 10GB
- **Port**: 8080
- **Auto-shutdown**: 30 minutes (saves costs)

**Environment Variables:**
```bash
NODE_ENV=production
PORT=8080
```

## 🔧 Other Deployment Options

### GitHub Pages
```bash
# Push to GitHub repository
git add .
git commit -m "Deploy portfolio"
git push origin main

# Enable GitHub Pages in repository settings
# Your site will be at: https://yourusername.github.io/repository-name
```

### Netlify
```bash
# Connect GitHub repository to Netlify
# Automatic deployments on every push
# Custom domain support
# Free SSL certificates
```

### Vercel
```bash
# Import GitHub repository to Vercel
# Zero-configuration deployment
# Automatic previews for pull requests
# Global CDN
```

### Traditional Web Hosting
```bash
# Upload files via FTP/SFTP
# No build process needed
# Works with any web hosting provider
```

## 📊 Performance Optimization

### Docker Optimizations
- **Multi-stage build**: Reduces image size
- **Nginx**: High-performance web server
- **Gzip compression**: Faster loading
- **Static file caching**: Better performance
- **Security headers**: Production-ready

### CDN Integration
```bash
# Add to nginx.conf for CDN
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    # Add CDN headers here
}
```

## 🔒 Security Features

### Built-in Security
- **Non-root user**: Container runs as nginx user
- **Security headers**: XSS, CSRF protection
- **Hidden files**: Deny access to sensitive files
- **Health checks**: Container monitoring
- **Resource limits**: Prevent resource exhaustion

### SSL/HTTPS
```bash
# For custom domains, add SSL certificates
# Most platforms (RunPod, Netlify, Vercel) provide free SSL
```

## 📈 Monitoring and Maintenance

### Health Checks
```bash
# Check container health
docker ps
docker logs viresh-portfolio

# Health endpoint
curl http://localhost:8080/health
```

### Updates
```bash
# Update content (edit JSON files)
# Rebuild image
docker build -t viresh-portfolio .

# Restart container
docker restart viresh-portfolio
```

### Backup
```bash
# Backup your data files
tar -czf portfolio-backup.tar.gz data/

# Backup Docker image
docker save viresh-portfolio > viresh-portfolio.tar
```

## 🆘 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker logs viresh-portfolio

# Check image exists
docker images | grep viresh-portfolio

# Rebuild if needed
docker build -t viresh-portfolio .
```

**Port not accessible:**
```bash
# Check port mapping
docker ps

# Check if port is in use
netstat -tulpn | grep 8080

# Try different port
docker run -p 3000:8080 viresh-portfolio
```

**Content not updating:**
```bash
# Rebuild after content changes
docker build -t viresh-portfolio .

# Clear browser cache
# Check JSON file syntax
```

### RunPod Specific Issues

**Pod won't start:**
- Check resource limits
- Verify Docker image exists
- Check RunPod logs

**Can't access website:**
- Verify port configuration
- Check RunPod network settings
- Try different port

## 🎯 Best Practices

### Development
- Test locally before deploying
- Use version control (Git)
- Keep Docker images small
- Use .dockerignore

### Production
- Use specific image tags (not :latest)
- Set resource limits
- Enable health checks
- Monitor logs regularly
- Keep backups

### Security
- Keep dependencies updated
- Use non-root containers
- Enable security headers
- Regular security audits

## 📞 Support

### Documentation
- [Docker Documentation](https://docs.docker.com)
- [RunPod Documentation](https://docs.runpod.io)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Community
- RunPod Discord
- Docker Community
- GitHub Issues

---

**Your portfolio is now ready for professional deployment! 🚀**
