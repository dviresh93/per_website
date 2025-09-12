async function showTimelineDetail(title) {
    try {
        // Load timeline data
        const response = await fetch('data/timeline.json');
        const data = await response.json();
        
        // Find the specific role data by matching cleaned title
        const roleData = data.journey.find(item => {
            const cleanedTitle = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            return cleanedTitle === title.toLowerCase();
        });
        
        if (!roleData) {
            console.error('Role data not found for:', title);
            return;
        }
        
        // Generate detail content based on role type
        let detailContent = '';
        
        if (roleData.type === 'career') {
            detailContent = `
                <div class="timeline-detail-wrapper">
                    <button onclick="showSection('journey')" class="back-button">
                        Back to Journey
                    </button>
                    <div class="project-hero">
                        <h2>${roleData.title}</h2>
                        <p>${roleData.company} • ${roleData.location} • ${roleData.year}</p>
                    </div>
                    
                    <div class="project-meta-grid">
                        <div class="meta-item">
                            <h4><i class="fas fa-building"></i> Company</h4>
                            <p>${roleData.company}</p>
                        </div>
                        <div class="meta-item">
                            <h4><i class="fas fa-map-marker-alt"></i> Location</h4>
                            <p>${roleData.location}</p>
                        </div>
                        <div class="meta-item">
                            <h4><i class="fas fa-calendar"></i> Duration</h4>
                            <p>${roleData.year}</p>
                        </div>
                        <div class="meta-item">
                            <h4><i class="fas fa-briefcase"></i> Role Type</h4>
                            <p>Full-time Position</p>
                        </div>
                    </div>
                    
                    <div class="project-content">
                        <h3><i class="fas fa-briefcase"></i> Role Overview</h3>
                        <div class="academic-description">${roleData.detailedDescription || roleData.description}</div>
                        
                        <br>
                        <h3><i class="fas fa-tasks"></i> Key Responsibilities</h3>
                        <ul class="responsibilities-list">
                            ${roleData.detailedResponsibilities ? roleData.detailedResponsibilities.map(resp => `<li>${resp}</li>`).join('') : roleData.responsibilities ? roleData.responsibilities.map(resp => `<li>${resp}</li>`).join('') : ''}
                        </ul>
                        
                        ${renderProjectSections(roleData.projects)}
                        
                        <h3><i class="fas fa-trophy"></i> Impact & Achievements</h3>
                        <div class="achievements-grid">
                            ${getAchievements(roleData.title)}
                        </div>
                    </div>
                </div>
            `;
        } else if (roleData.type === 'education') {
            detailContent = `
                <div class="timeline-detail-wrapper">
                    <button onclick="showSection('journey')" class="back-button">
                        Back to Journey
                    </button>
                    <div class="project-hero">
                        <h2>${roleData.degree}</h2>
                        <p>${roleData.institution} • ${roleData.location} • ${roleData.year}</p>
                    </div>
                    
                    <div class="project-meta-grid">
                        <div class="meta-item">
                            <h4><i class="fas fa-university"></i> Institution</h4>
                            <p>${roleData.institution}</p>
                        </div>
                        <div class="meta-item">
                            <h4><i class="fas fa-graduation-cap"></i> Degree</h4>
                            <p>${roleData.degree}</p>
                        </div>
                        <div class="meta-item">
                            <h4><i class="fas fa-calendar"></i> Years</h4>
                            <p>${roleData.year}</p>
                        </div>
                        ${roleData.advisor ? `
                        <div class="meta-item">
                            <h4><i class="fas fa-user-tie"></i> Advisor</h4>
                            <p>${roleData.advisor}</p>
                        </div>
                        ` : ''}
                        ${roleData.thesis ? `
                        <div class="meta-item">
                            <h4><i class="fas fa-scroll"></i> Thesis</h4>
                            <p>${roleData.thesis}</p>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="project-content">
                        <h3><i class="fas fa-book"></i> Academic Journey</h3>
                        <div class="academic-description">${roleData.detailedDescription || roleData.description}</div>
                        
                        <br>
                        <h3><i class="fas fa-tasks"></i> Key Contributions</h3>
                        <ul class="responsibilities-list">
                            ${roleData.detailedResponsibilities ? roleData.detailedResponsibilities.map(resp => `<li>${resp}</li>`).join('') : roleData.responsibilities ? roleData.responsibilities.map(resp => `<li>${resp}</li>`).join('') : ''}
                        </ul>
                        
                        ${roleData.projectId ? `
                            <h3><i class="fas fa-folder-open"></i> Project Details</h3>
                            <div class="career-project-item clickable-project" onclick="showProject('${roleData.projectId}')">
                                <h4>Precision Delivery Drone (Baton) <i class="fas fa-external-link-alt project-link-icon"></i></h4>
                                <p>View thesis project details, videos, and research materials</p>
                            </div>
                        ` : ''}
                        
                        <br>
                        
                        <h3><i class="fas fa-trophy"></i> Impact & Achievements</h3>
                        <div class="achievements-grid">
                            ${getEducationAchievements(roleData.title)}
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Load content into timeline detail section
        const detailSection = document.getElementById('timeline-detail');
        if (detailSection) {
            detailSection.innerHTML = detailContent;
        }
        
        // Use unified navigation system
        if (window.portfolioApp) {
            window.portfolioApp.showSection('timeline-detail');
        }
        
    } catch (error) {
        console.error('Error loading timeline detail:', error);
        const detailSection = document.getElementById('timeline-detail');
        if (detailSection) {
            detailSection.innerHTML = '<div class="error-message">Error loading content. Please try again.</div>';
            if (window.portfolioApp) {
                window.portfolioApp.showSection('timeline-detail');
            }
        }
    }
}

function renderProjectSections(projects) {
    if (!projects || projects.length === 0) return '';
    
    const featuredProjects = projects.filter(project => project.type === 'featured');
    
    if (featuredProjects.length === 0) return '';
    
    return `
        <h3><i class="fas fa-project-diagram"></i> Project Details</h3>
        <div class="timeline-projects">
            ${featuredProjects.map(project => `
                <div class="career-project-item clickable-project" onclick="showProject('${project.projectId}')">
                    <h4>${project.name} <i class="fas fa-external-link-alt project-link-icon"></i></h4>
                    <p>${project.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function getAchievements(title) {
    const achievements = {
        'Agentic AI Consultant': [
            { icon: 'fas fa-brain', text: 'Architected GridCOP agent as intelligent extension of Grid CoOperator\'s RECOVER analytics platform' },
            { icon: 'fas fa-database', text: 'Implemented autonomous database querying with intelligent context gathering capabilities' },
            { icon: 'fas fa-shield-alt', text: 'Built data validation systems ensuring accuracy in mission-critical smart grid operations' },
            { icon: 'fas fa-comments', text: 'Created conversational AI interface enabling natural language interaction with smart grid data' },
            { icon: 'fas fa-cogs', text: 'Applied agentic AI principles to create independent, reliable agents for power grid decision support' }
        ],
        'Drone Systems Engineer': [
            { icon: 'fas fa-mobile-alt', text: 'Led initial Remote ID compliance efforts and developed one-stop app store for Freefly drones' },
            { icon: 'fas fa-tools', text: 'Developed comprehensive diagnostic tools for crash analysis and issue reproduction' },
            { icon: 'fas fa-shield-alt', text: 'Designed exhaustive test plans validating system integrity before every software release' },
            { icon: 'fas fa-robot', text: 'Automated production and support workflows, reducing response time by 60%' },
            { icon: 'fas fa-brain', text: 'Pioneered transition from drone systems engineering to AI agent development' }
        ],
        'Software Engineer': [
            { icon: 'fas fa-users', text: 'Part of core 5-member team that secured funding for multiple project rounds' },
            { icon: 'fas fa-clock', text: 'Met all deliverables within defined timeline for harsh-environment drone system' },
            { icon: 'fas fa-shield-alt', text: 'Enabled drone operations in GPS-denied environments and various lighting conditions' },
            { icon: 'fas fa-eye', text: 'Achieved 360° obstacle avoidance capabilities for surveillance applications' },
            { icon: 'fas fa-rocket', text: 'Contributed to open-source PX4 flight control software used globally by drone community' }
        ],
        'Robotics R&D Engineer': [
            { icon: 'fas fa-eye', text: 'Developed computer vision algorithms for autonomous surveillance' },
            { icon: 'fas fa-compass', text: 'Implemented advanced navigation systems for mobile robots' },
            { icon: 'fas fa-handshake', text: 'Built intuitive HMI for collaborative robotic arm programming' },
            { icon: 'fas fa-flask', text: 'Prototyped innovative solutions for autonomous robotic systems' }
        ]
    };
    
    const roleAchievements = achievements[title] || [];
    return roleAchievements.map(achievement => `
        <div class="achievement-item">
            <i class="${achievement.icon}"></i>
            <span>${achievement.text}</span>
        </div>
    `).join('');
}

function getEducationAchievements(title) {
    const achievements = {
        'Master of Science in Computer Science': [
            { icon: 'fas fa-users', text: 'Successfully led cross-disciplinary collaboration with mechanical and electrical engineering teams' },
            { icon: 'fas fa-rocket', text: 'Secured 2nd round of funding through successful proof-of-concept demonstration' },
            { icon: 'fas fa-trophy', text: 'Awarded 2nd place at JCATI Symposium 2016 for precision delivery drone presentation' },
            { icon: 'fas fa-check-circle', text: 'Delivered working prototype capable of UAV-dropped controlled descent to target location' },
            { icon: 'fas fa-money-bill-wave', text: 'Project approved for 3rd round of funding based on prototype success' }
        ]
    };
    
    const roleAchievements = achievements[title] || [];
    return roleAchievements.map(achievement => `
        <div class="achievement-item">
            <i class="${achievement.icon}"></i>
            <span>${achievement.text}</span>
        </div>
    `).join('');
}

// Function to show project from timeline
function showProject(projectId) {
    console.log('Timeline showProject called with:', projectId);
    // Use the project manager if available
    if (window.projectManager) {
        window.projectManager.showProject(projectId);
    } else if (window.portfolioApp && window.portfolioApp.projectManager) {
        window.portfolioApp.projectManager.showProject(projectId);
    } else {
        console.error('Project manager not found');
    }
}

// Make functions globally available
window.showTimelineDetail = showTimelineDetail;
window.showProject = showProject;
