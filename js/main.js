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
            'data/projects.json'
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

        const [profile, skills, timeline, projects] = await Promise.all(promises);
        
        this.data = {
            profile: profile || this.getDefaultProfile(),
            skills: skills || this.getDefaultSkills(),
            timeline: timeline || this.getDefaultTimeline(),
            projects: projects || this.getDefaultProjects()
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
                    <a href="mailto:${profile.contact.email}" title="Email">
                        <i class="fas fa-envelope"></i>
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

            timeline.journey.forEach((item, index) => {
                try {
                    const companyInfo = item.company || item.institution || "";
                    
                    // Create a shorter, cleaner description
                    const descriptions = item.description ? item.description.split('.') : [];
                    const shortDescription = descriptions.length > 0 ? descriptions[0] + '.' : "";
                    const bulletPoints = descriptions.slice(1, 4).filter(d => d.trim().length > 0).map(d => d.trim()).slice(0, 3);
                    
                    const keyProjectsHTML = item.projects ? `
                        <div class="timeline-projects">
                            <h4>🔗 Key Projects:</h4>
                            <div class="project-tags">
                                ${item.projects.map(project => `
                                    <span class="project-tag-small">${project.name}</span>
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
                                    ${shortDescription ? `<p class="career-highlight">${shortDescription}</p>` : ""}
                                    ${bulletPoints.length > 0 ? `
                                        <ul class="career-bullets">
                                            ${bulletPoints.map(point => `<li>${point}</li>`).join("")}
                                        </ul>
                                    ` : ""}
                                </div>
                                ${keyProjectsHTML}
                            </div>
                        </div>
                    `;
                } catch (itemError) {
                    console.error("Error rendering timeline item:", item, itemError);
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
                github: "#",
                email: "viresh@example.com"
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
