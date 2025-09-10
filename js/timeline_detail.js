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
                        <h3><i class="fas fa-tasks"></i> Key Responsibilities</h3>
                        <p>${roleData.description}</p>
                        
                        <h3><i class="fas fa-project-diagram"></i> Key Projects</h3>
                        <div class="timeline-projects">
                            ${roleData.projects.map(project => `
                                <div class="career-project-item ${project.projectId ? 'clickable-project' : ''}" ${project.projectId ? `onclick="showProject('${project.projectId}')"` : ''}>
                                    <h4>${project.name} ${project.projectId ? '<i class="fas fa-external-link-alt project-link-icon"></i>' : ''}</h4>
                                    <p>${project.description}</p>
                                </div>
                            `).join('')}
                        </div>
                        
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
                    </div>
                    
                    <div class="project-content">
                        <h3><i class="fas fa-book"></i> Academic Focus</h3>
                        <p>${roleData.description}</p>
                        
                        ${roleData.projectId ? `
                            <h3><i class="fas fa-project-diagram"></i> Related Project</h3>
                            <div class="career-project-item clickable-project" onclick="showProject('${roleData.projectId}')">
                                <h4>View Thesis Project <i class="fas fa-external-link-alt project-link-icon"></i></h4>
                                <p>See detailed project information, videos, and research materials</p>
                            </div>
                        ` : ''}
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

function getAchievements(title) {
    const achievements = {
        'Drone Systems Engineer': [
            { icon: 'fas fa-cogs', text: 'Led cross-team technical projects from requirements to deployment' },
            { icon: 'fas fa-bug', text: 'Analyzed and resolved complex drone crash investigations' },
            { icon: 'fas fa-chart-line', text: 'Streamlined production processes for manufacturing efficiency' },
            { icon: 'fas fa-robot', text: 'Automated support workflows reducing response time by 60%' }
        ],
        'Software Engineer': [
            { icon: 'fas fa-code', text: 'Developed custom PX4 flight modes including Toss to Launch' },
            { icon: 'fas fa-satellite', text: 'Integrated advanced sensors using MAVLink and UAVCAN protocols' },
            { icon: 'fas fa-route', text: 'Optimized GPS and obstacle avoidance systems for autonomous flight' },
            { icon: 'fas fa-microchip', text: 'Enhanced flight controller performance and reliability' }
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
