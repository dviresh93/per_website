// Main JavaScript for Portfolio Website
class PortfolioApp {
    constructor() {
        this.currentSection = 'journey';
        this.data = {
            profile: null,
            skills: null,
            timeline: null,
            projects: null
        };
        this.init();
    }

    async init() {
        try {
            console.log("Initializing portfolio...");
            await this.loadData();
            console.log("Data loaded successfully");
            
            this.setupEventListeners();
            console.log("Event listeners set up");
            
            this.renderProfile();
            console.log("Profile rendered");
            
            this.renderSkills();
            console.log("Skills rendered");
            
            this.renderTimeline();
            console.log("Timeline rendered");
            
            this.renderProjects();
            this.renderCertificates();
            console.log("Projects rendered");
            
            this.setupNavigation();
            console.log("Navigation set up");
            
            // Initialize Project Manager
            this.initializeProjectManager();
            console.log("Project Manager initialized");
            
            console.log("Portfolio initialization complete!");
        } catch (error) {
            console.error("Error initializing portfolio:", error);
            console.error("Error stack:", error.stack);
            this.showError("Failed to load portfolio data: " + error.message);
        }
    }

    async loadData() {
        const dataFiles = [
            'data/profile.json',
            'data/skills.json',
            'data/timeline.json',
            'data/projects.json',
            'data/certificates.json'
        ];

        const promises = dataFiles.map(async (file) => {
            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Failed to load ${file}`);
                return response.json();
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
                return null;
            }
        });

        const [profile, skills, timeline, projects, certificates] = await Promise.all(promises);
        
        this.data = {
            profile: profile || this.getDefaultProfile(),
            skills: skills || this.getDefaultSkills(),
            timeline: timeline || this.getDefaultTimeline(),
            projects: projects || this.getDefaultProjects(),
            certificates: certificates || this.getDefaultCertificates()
        };
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Project filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.dataset.filter;
                this.filterProjects(filter);
                
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                // Only process valid anchor links, not empty # or onclick handlers
                if (href && href.length > 1 && !anchor.hasAttribute('onclick')) {
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.showSection('journey');
            }
        });
    }

    renderProfile() {
        try {
            console.log("Starting renderProfile...");
            const profile = this.data.profile;
            if (!profile) {
                console.log("No profile data available");
                return;
            }
            console.log("Profile data:", profile);

        // Update page title
        console.log("Looking for page-title element...");
        const pageTitle = document.getElementById('page-title');
        console.log("pageTitle element:", pageTitle);
        if (pageTitle) {
            console.log("Setting page title to:", `${profile.name} - ${profile.tagline}`);
            pageTitle.textContent = `${profile.name} - ${profile.tagline}`;
        } else {
            console.error("page-title element not found!");
        }
        
        // Update navigation logo
        
        // Update profile section
        console.log("Looking for profile-name element...");
        const profileName = document.getElementById('profile-name');
        console.log("profileName element:", profileName);
        if (profileName) {
            console.log("Setting profile name to:", profile.name);
            profileName.textContent = profile.name;
        } else {
            console.error("profile-name element not found!");
        }
        
        console.log("Looking for profile-tagline element...");
        const profileTagline = document.getElementById('profile-tagline');
        console.log("profileTagline element:", profileTagline);
        if (profileTagline) {
            console.log("Setting profile tagline to:", profile.tagline);
            profileTagline.textContent = profile.tagline;
        } else {
            console.error("profile-tagline element not found!");
        }
        
        console.log("Looking for profile-subtitle element...");
        const profileSubtitle = document.getElementById('profile-subtitle');
        console.log("profileSubtitle element:", profileSubtitle);
        if (profileSubtitle) {
            console.log("Setting profile subtitle to:", profile.subtitle);
            profileSubtitle.textContent = profile.subtitle;
        } else {
            console.error("profile-subtitle element not found!");
        }

        // Update contact links
        const contactLinks = document.getElementById('contact-links');
        if (contactLinks && profile.contact) {
            contactLinks.innerHTML = '';
            
            if (profile.contact.linkedin) {
                contactLinks.innerHTML += `
                    <a href="${profile.contact.linkedin}" target="_blank" title="LinkedIn">
                        <i class="fab fa-linkedin"></i>
                    </a>
                `;
            }
            
            if (profile.contact.github) {
                contactLinks.innerHTML += `
                    <a href="${profile.contact.github}" target="_blank" title="GitHub">
                        <i class="fab fa-github"></i>
                    </a>
                `;
            }
            
            if (profile.contact.email) {
                contactLinks.innerHTML += `
                    <a href="#" onclick="showEmailPopup('${profile.contact.email}')" title="Show Email">
                        <i class="fas fa-envelope"></i>
                    </a>
                `;
            }
            
            if (profile.contact.resume) {
                contactLinks.innerHTML += `
                    <a href="${profile.contact.resume}" title="Download Resume" download>
                        <i class="fas fa-download"></i>
                    </a>
                `;
            }
        }
        } catch (error) {
            console.error("Error in renderProfile:", error);
            console.error("Error stack:", error.stack);
        }
    }

    renderSkills() {
        const skillsContainer = document.getElementById('sidebar-skills');
        if (!skillsContainer || !this.data.skills) return;

        const skills = this.data.skills;
        let skillsHTML = '<h3>Core Skills</h3>';

        skills.categories.forEach(category => {
            skillsHTML += `
                <div class="skill-category">
                    <h4>${category.name}</h4>
                    <div class="skill-list">
                        ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        });

        skillsContainer.innerHTML = skillsHTML;
    }

    renderTimeline() {
        try {
            console.log("Starting timeline render...");
            const timelineContainer = document.getElementById("timeline-container");
            if (!timelineContainer) {
                console.error("Timeline container not found");
                return;
            }
            console.log("Timeline container found");

            if (!this.data.timeline || !this.data.timeline.journey) {
                console.error("Timeline data not found, data:", this.data);
                timelineContainer.innerHTML = "<p>Loading timeline...</p>";
                return;
            }
            
            console.log("Timeline data found:", this.data.timeline.journey.length, "items");

            const timeline = this.data.timeline;
            let timelineHTML = "";
            let currentSection = null;

            timeline.journey.forEach((item, index) => {
                try {
                    // Add section header if we're starting a new section
                    if (item.type !== currentSection) {
                        if (item.type === 'career') {
                            timelineHTML += `
                                <h2 class="timeline-section-header">
                                    <i class="fas fa-briefcase"></i> Career
                                </h2>
                            `;
                        } else if (item.type === 'education') {
                            timelineHTML += `
                                <h2 class="timeline-section-header">
                                    <i class="fas fa-graduation-cap"></i> Education
                                </h2>
                            `;
                        }
                        currentSection = item.type;
                    }
                    
                    const companyInfo = item.company || item.institution || "";
                    
                    // Use responsibilities if available, otherwise fall back to description parsing
                    const responsibilityHTML = item.responsibilities ? `
                        <ul class="role-responsibilities">
                            ${item.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    ` : '';
                    
                    const keyProjectsHTML = item.projects && item.projects.length > 0 ? `
                        <div class="timeline-projects">
                            <h4>Featured Projects:</h4>
                            <div class="featured-projects-simple">
                                ${item.projects.map(project => `
                                    <div class="featured-project-card" onclick="event.stopPropagation(); showProject('${project.projectId}')">
                                        <h5>${project.name}</h5>
                                        <p>${project.description}</p>
                                        <span class="learn-more">Click to learn more →</span>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    ` : "";
                    
                    timelineHTML += `
                        <div class="project-card career-card" onclick="showTimelineDetail('${item.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}')">
                            <div class="project-card-header">
                                <div class="career-header-meta">
                                    <span class="project-tag timeline-year">${item.year}</span>
                                    <span class="project-tag timeline-location">${item.location}</span>
                                </div>
                                <h3>${item.title}</h3>
                                <p>${companyInfo}</p>
                            </div>
                            <div class="project-card-body">
                                <div class="career-summary">
                                    <p class="career-highlight">${item.description}</p>
                                    ${responsibilityHTML}
                                </div>
                                <div class="learn-more-section">
                                    <button class="learn-more-btn" onclick="event.stopPropagation(); showTimelineDetail('${item.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}')">Click me to learn more →</button>
                                </div>
                                ${keyProjectsHTML}
                            </div>
                        </div>
                    `;
                } catch (itemError) {
                    console.error("Error rendering timeline item:", itemError, item);
                }
            });

            // Use the same container structure as projects
            timelineContainer.innerHTML = timelineHTML;
            console.log("Timeline rendered successfully with", timeline.journey.length, "items");
        } catch (error) {
            console.error("Error in renderTimeline:", error);
            const timelineContainer = document.getElementById("timeline-container");
            if (timelineContainer) {
                timelineContainer.innerHTML = `<p>Error loading timeline: ${error.message}</p>`;
            }
        }
    }

    formatDescriptionAsList(descriptionText) {
        const sentences = descriptionText
            .split(/\.(\s+|$)/)
            .map(s => s && s.trim())
            .filter(Boolean);
        if (sentences.length === 0) {
            return "";
        }
        const items = sentences.map(s => `<li>${s.replace(/^[-–•\s]+/, '')}</li>`).join("");
        return `<ul class="timeline-bullets">${items}</ul>`;
    }

    renderProjects() {
        const projectsContainer = document.getElementById('projects-container');
        const dropdownContainer = document.getElementById('projects-dropdown');
        
        if (!projectsContainer || !this.data.projects) return;

        const projects = this.data.projects;
        
        // Render projects list
        let projectsHTML = '';
        let dropdownHTML = '';

        projects.projects.forEach(project => {
            // Main projects list
            projectsHTML += `
                <div class="project-card" data-category="${project.category}" onclick="showProject('${project.id}')">
                    <div class="project-card-header">
                        <h3>${project.title}</h3>
                        <p>${project.subtitle}</p>
                    </div>
                    <div class="project-card-body">
                        <p>${project.description}</p>
                        <div class="project-meta">
                            <span class="project-tag">${project.category}</span>
                            <span class="project-tag">${project.timeline}</span>
                        </div>
                    </div>
                </div>
            `;

            // Dropdown menu
            dropdownHTML += `
                <a href="#" onclick="showProject('${project.id}')">${project.title}</a>
            `;
        });

        projectsContainer.innerHTML = projectsHTML;
        if (dropdownContainer) {
            dropdownContainer.innerHTML = dropdownHTML;
        }
    }

    renderCertificates() {
        const certificatesContainer = document.getElementById('certificates-container');
        
        if (!certificatesContainer || !this.data.certificates) return;

        const certificates = this.data.certificates;
        
        // Render certificates list
        let certificatesHTML = '';

        certificates.certificates.forEach(certificate => {
            certificatesHTML += `
                <div class="certificate-card" data-category="${certificate.category}">
                    <div class="certificate-card-header">
                        <h3>${certificate.title}</h3>
                        <p class="certificate-issuer">${certificate.issuer} • ${certificate.issueDate}</p>
                    </div>
                    <div class="certificate-card-body">
                        <p>${certificate.description}</p>
                        <div class="certificate-skills">
                            ${certificate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                        <div class="certificate-actions">
                            <a href="${certificate.credentialUrl}" target="_blank" class="certificate-link">
                                <i class="fas fa-external-link-alt"></i> View Certificate
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

        certificatesContainer.innerHTML = certificatesHTML;
    }

    setupNavigation() {
        // Update active navigation link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === this.currentSection) {
                link.classList.add('active');
            }
        });
    }

    showSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;

        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Show target section
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        this.currentSection = sectionId;
        this.setupNavigation();
        
        // Scroll to top of content
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'slideIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showError(message) {
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    // Default data fallbacks
    getDefaultProfile() {
        return {
            name: "Viresh Duvvuri",
            tagline: "Building Intelligence That Works",
            subtitle: "Systems Engineer | Automation Specialist | Problem Solver",
            profileImage: "VD",
            contact: {
                linkedin: "https://linkedin.com/in/viresh-duvvuri/",
                github: "https://github.com/dviresh93",
                email: "vireshduvvuri@gmail.com",
                resume: "resume/Viresh_Duvvuri_Resume.pdf"
            }
        };
    }

    getDefaultSkills() {
        return {
            categories: [
                {
                    name: "Programming",
                    skills: ["Python", "C++", "React", "SQL", "JavaScript"]
                },
                {
                    name: "AI & Machine Learning",
                    skills: ["AI Agents", "Machine Learning", "Data Analysis"]
                }
            ]
        };
    }

    getDefaultTimeline() {
        return {
            journey: [
                {
                    year: "2024-Present",
                    title: "AI Agent Development",
                    description: "Transitioning from robotics to AI agents, developing intelligent automation tools."
                }
            ]
        };
    }

    getDefaultProjects() {
        return {
            projects: [
                {
                    id: "sample-project",
                    title: "Sample Project",
                    subtitle: "AI-powered solution",
                    description: "A sample project description.",
                    category: "AI Agents",
                    timeline: "2024"
                }
            ]
        };
    }

    getDefaultCertificates() {
        return {
            certificates: [
                {
                    id: "sample-cert",
                    title: "Sample Certificate",
                    issuer: "Sample Institution",
                    issueDate: "2024",
                    category: "Sample"
                }
            ]
        };
    }

    initializeProjectManager() {
        // Initialize the project manager with reference to this app
        if (window.ProjectManager) {
            this.projectManager = new window.ProjectManager(this);
            window.projectManager = this.projectManager;
        } else {
            console.warn("ProjectManager class not found");
        }
    }

    showProject(projectId) {
        console.log("PortfolioApp.showProject called with:", projectId);
        if (this.projectManager) {
            this.projectManager.showProject(projectId);
        } else {
            console.error("Project manager not initialized");
        }
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionId) {
    if (window.portfolioApp) {
        window.portfolioApp.showSection(sectionId);
    }
}

function showProject(projectId) {
    if (window.portfolioApp) {
        window.portfolioApp.showProject(projectId);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible, refresh data if needed
        console.log('Page became visible');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Handle responsive adjustments if needed
    console.log('Window resized');
});

// Timeline Detail Functions - Handled by timeline_detail.js

// Email popup function
function showEmailPopup(email) {
    // Remove existing popup if any
    const existingPopup = document.getElementById('email-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'email-popup';
    popup.innerHTML = `
        <div class="email-popup-overlay" onclick="closeEmailPopup()">
            <div class="email-popup-content" onclick="event.stopPropagation()">
                <h3>Contact Email</h3>
                <div class="email-display">${email}</div>
                <div class="email-actions">
                    <button onclick="copyEmailToClipboard('${email}')" class="copy-btn">
                        <i class="fas fa-copy"></i> Copy Email
                    </button>
                    <button onclick="window.open('mailto:${email}', '_blank')" class="mail-btn">
                        <i class="fas fa-envelope"></i> Send Email
                    </button>
                </div>
                <button onclick="closeEmailPopup()" class="close-btn">×</button>
            </div>
        </div>
    `;
    
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
    `;
    
    document.body.appendChild(popup);
}

function closeEmailPopup() {
    const popup = document.getElementById('email-popup');
    if (popup) {
        popup.remove();
    }
}

function copyEmailToClipboard(email) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            showToast('Email copied to clipboard!');
            closeEmailPopup();
        }).catch(() => {
            fallbackCopyToClipboard(email);
        });
    } else {
        fallbackCopyToClipboard(email);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Email copied to clipboard!');
        closeEmailPopup();
    } catch (err) {
        showToast('Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

function showToast(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        box-shadow: var(--shadow-lg);
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
