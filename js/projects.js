// Projects functionality for Portfolio Website
class ProjectManager {
    constructor(portfolioApp) {
        this.app = portfolioApp;
        this.currentProject = null;
        this.init();
    }

    init() {
        this.setupProjectEventListeners();
    }

    setupProjectEventListeners() {
        // Handle project card clicks
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard && projectCard.dataset.category) { // Only for actual project cards
                e.preventDefault();
                // Get project ID from onclick attribute
                const onclickStr = projectCard.getAttribute('onclick');
                if (onclickStr) {
                    const projectId = onclickStr.match(/showProject\('([^']+)'\)/)?.[1];
                    if (projectId) {
                        console.log('Clicking project:', projectId);
                        this.showProject(projectId);
                        return;
                    }
                }
            }
        });
    }

    showProject(projectId) {
        console.log('showProject called with:', projectId);
        console.log('ProjectManager instance:', this);
        const project = this.findProjectById(projectId);
        if (!project) {
            console.error(`Project not found: ${projectId}`);
            console.log('Available projects:', this.app.data.projects?.projects?.map(p => p.id));
            return;
        }

        console.log('Found project:', project.title);
        this.currentProject = project;
        this.renderProjectDetail(project);
        
        // Use unified navigation system
        if (this.app) {
            this.app.showSection('project-detail');
        }
    }

    hideProject() {
        this.currentProject = null;
        // Use unified navigation system
        if (this.app) {
            this.app.showSection('projects-list');
        }
    }

    findProjectById(projectId) {
        if (!this.app.data.projects) return null;
        
        return this.app.data.projects.projects.find(project => 
            project.id === projectId || 
            project.id === projectId.replace(/-/g, '') ||
            project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === projectId
        );
    }

    renderProjectDetail(project) {
        const container = document.getElementById('project-detail');
        if (!container) return;

        const projectHTML = `
            <div class="project-detail-wrapper">
                <button onclick="showSection('projects-list')" class="back-button">Back to Projects</button>
                <div class="project-detail">
                    <div class="project-hero">
                        <h2>${project.title}</h2>
                        <p>${project.subtitle}</p>
                    </div>
                    
                    <div class="project-meta-grid">
                        <div class="meta-item">
                            <h4>Technologies</h4>
                            <p>${Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || 'Various technologies'}</p>
                        </div>
                    </div>

                    <div class="project-content">
                        ${this.renderProjectContent(project)}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = projectHTML;
    }

    renderProjectContent(project) {
        if (!project.details) {
            return `
                <h3>Project Overview</h3>
                <p>${project.description}</p>
                <p>This project demonstrates expertise in ${project.category || 'various technologies'} and showcases problem-solving abilities in real-world applications.</p>
            `;
        }

        let content = '';

        if (project.details.overview) {
            content += `
                <h3>Project Overview</h3>
                <p>${project.details.overview}</p>
            `;
        }

        if (project.details.features && project.details.features.length > 0) {
            content += `
                <h3>Key Features</h3>
                <ul>
                    ${project.details.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `;
        }

        if (project.details.approach) {
            content += `
                <h3>Technical Approach</h3>
                <p>${project.details.approach}</p>
            `;
        }

        if (project.details.challenges) {
            content += `
                <h3>Challenges & Solutions</h3>
                <p>${project.details.challenges}</p>
            `;
        }

        if (project.details.results) {
            content += `
                <h3>Results & Impact</h3>
                <p>${project.details.results}</p>
            `;
        }

        if (project.details.technologies) {
            content += `
                <h3>Technologies Used</h3>
                <p>${Array.isArray(project.details.technologies) ? project.details.technologies.join(', ') : project.details.technologies}</p>
            `;
        }

        if (project.videos && project.videos.length > 0) {
            content += `
                <h3>Project Videos</h3>
                <div class="project-videos">
                    ${project.videos.map(video => `
                        <div class="video-item">
                            <h4>${video.title}</h4>
                            <p>${video.description}</p>
                            <a href="${video.url}" target="_blank" class="video-link">Watch Video</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        if (project.media && project.media.length > 0) {
            content += `
                <h3>Project Media</h3>
                <div class="project-media">
                    ${project.media.map(media => `
                        <div class="media-item">
                            <img src="${media.url}" alt="${media.title}" class="media-image" onclick="openImageModal('${media.url}', '${media.title}')">
                            <div class="media-content">
                                <h4>${media.title}</h4>
                                <p>${media.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        if (project.links && project.links.length > 0) {
            content += `
                <h3>Project Links</h3>
                <div class="project-links">
                    ${project.links.map(link => `
                        <div class="link-item">
                            <h4>${link.title}</h4>
                            <p>${link.description}</p>
                            <a href="${link.url}" target="_blank" class="project-link">Visit Link</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return content;
    }

    // Method to add new project dynamically
    addProject(projectData) {
        if (!this.app.data.projects) {
            this.app.data.projects = { projects: [] };
        }
        
        this.app.data.projects.projects.push(projectData);
        this.app.renderProjects();
    }

    // Method to update existing project
    updateProject(projectId, updates) {
        const project = this.findProjectById(projectId);
        if (project) {
            Object.assign(project, updates);
            this.app.renderProjects();
            
            // If this is the currently displayed project, refresh the view
            if (this.currentProject && this.currentProject.id === project.id) {
                this.renderProjectDetail(project);
            }
        }
    }

    // Method to remove project
    removeProject(projectId) {
        if (!this.app.data.projects) return;
        
        const index = this.app.data.projects.projects.findIndex(project => project.id === projectId);
        if (index > -1) {
            this.app.data.projects.projects.splice(index, 1);
            this.app.renderProjects();
            
            // If this was the currently displayed project, hide it
            if (this.currentProject && this.currentProject.id === projectId) {
                this.hideProject();
            }
        }
    }

    // Method to get project statistics
    getProjectStats() {
        if (!this.app.data.projects) return null;
        
        const projects = this.app.data.projects.projects;
        const categories = {};
        const technologies = {};
        
        projects.forEach(project => {
            // Count categories
            const category = project.category || 'Other';
            categories[category] = (categories[category] || 0) + 1;
            
            // Count technologies
            if (project.technologies) {
                const techs = Array.isArray(project.technologies) ? project.technologies : [project.technologies];
                techs.forEach(tech => {
                    technologies[tech] = (technologies[tech] || 0) + 1;
                });
            }
        });
        
        return {
            total: projects.length,
            categories,
            technologies,
            recent: projects.slice(0, 3) // Most recent 3 projects
        };
    }
}

// Image modal functionality
function openImageModal(imageUrl, title) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="closeImageModal()">&times;</span>
            <img src="${imageUrl}" alt="${title}" class="modal-image">
            <div class="modal-title">${title}</div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
    }
}

// Make functions available globally
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;

// Make ProjectManager available globally
window.ProjectManager = ProjectManager;

// Initialize project manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for portfolio app to be initialized
    const initProjectManager = () => {
        if (window.portfolioApp) {
            window.projectManager = new ProjectManager(window.portfolioApp);
        } else {
            setTimeout(initProjectManager, 100);
        }
    };
    initProjectManager();
});
