# Content Management Guide

This guide makes it super easy to add, remove, or modify content on your portfolio website.

## 🎯 Quick Reference

| What to Change | File to Edit | Section |
|----------------|--------------|---------|
| Name, title, contact info | `data/profile.json` | Personal Info |
| Skills and technologies | `data/skills.json` | Skills |
| Career timeline | `data/timeline.json` | Timeline |
| Projects | `data/projects.json` | Projects |
| Colors and styling | `css/main.css` | Appearance |
| Layout and structure | `index.html` | Structure |

## 📝 Step-by-Step Content Updates

### 1. Adding a New Project

**Step 1**: Open `data/projects.json`

**Step 2**: Add your project to the `projects` array:
```json
{
  "id": "my-new-project",
  "title": "My Amazing Project",
  "subtitle": "AI-powered solution",
  "description": "This project does amazing things using AI",
  "technologies": ["Python", "Machine Learning", "React"],
  "impact": "Improved efficiency by 50%",
  "timeline": "2024",
  "category": "AI Agents",
  "details": {
    "overview": "Detailed description of what the project does and why it's important.",
    "features": [
      "Feature 1: Does this amazing thing",
      "Feature 2: Solves this problem",
      "Feature 3: Integrates with that system"
    ],
    "approach": "How you approached building this project technically.",
    "challenges": "What challenges you faced and how you solved them.",
    "results": "What results you achieved and the impact it had."
  }
}
```

**Step 3**: Save the file and refresh your browser!

### 2. Updating Your Timeline

**Step 1**: Open `data/timeline.json`

**Step 2**: Modify existing entries or add new ones:
```json
{
  "year": "2024-Present",
  "title": "Your Current Role",
  "description": "What you're doing now and your impact",
  "projects": [
    {
      "name": "Project Name",
      "description": "What this project does"
    }
  ]
}
```

### 3. Adding New Skills

**Step 1**: Open `data/skills.json`

**Step 2**: Add skills to existing categories or create new ones:
```json
{
  "name": "New Category",
  "skills": ["New Skill 1", "New Skill 2", "New Skill 3"]
}
```

### 4. Changing Colors

**Step 1**: Open `css/main.css`

**Step 2**: Find the `:root` section and change colors:
```css
:root {
  --primary-color: #your-color;     /* Main brand color */
  --secondary-color: #your-color;   /* Secondary color */
  --accent-color: #your-color;      /* Accent color */
}
```

## 🗂️ Content Categories

### Project Categories
- **AI Agents**: AI-powered automation and intelligent systems
- **Robotics**: Hardware, embedded systems, flight control
- **Automation**: Workflow automation, tools, and processes

### Skill Categories
- **Programming**: Languages and frameworks
- **AI & Machine Learning**: AI/ML technologies and tools
- **Robotics & Drones**: Hardware and flight systems
- **Embedded Systems**: Low-level programming and hardware
- **Tools & Platforms**: Development and deployment tools

## 📋 Content Checklist

### Before Publishing
- [ ] All JSON files have valid syntax
- [ ] Project descriptions are clear and compelling
- [ ] Contact information is up to date
- [ ] Skills reflect current expertise
- [ ] Timeline is accurate and complete
- [ ] Images are optimized (if any)

### Regular Maintenance
- [ ] Add new projects as completed
- [ ] Update timeline with new roles
- [ ] Refresh skills with new technologies
- [ ] Review and improve project descriptions
- [ ] Check all links work correctly

## 🎨 Styling Tips

### Professional Look
- Use consistent terminology
- Keep descriptions concise but informative
- Highlight impact and results
- Use action verbs in descriptions

### Writing Style
- Write in first person for personal sections
- Use present tense for current roles
- Use past tense for completed projects
- Be specific about technologies and tools

## 🔧 Advanced Customization

### Adding New Sections
1. Add HTML structure in `index.html`
2. Add CSS styles in `css/components.css`
3. Add JavaScript functionality in `js/main.js`

### Custom Project Types
Add new project categories by:
1. Adding filter button in `index.html`
2. Updating filter logic in `js/main.js`
3. Adding category-specific styling if needed

## 📱 Mobile Optimization

Your content automatically adapts to mobile devices. Tips for mobile-friendly content:
- Keep project titles short
- Use bullet points for features
- Write concise descriptions
- Test on mobile devices

## 🚀 Publishing Updates

### Local Testing
1. Open `index.html` in your browser
2. Test all navigation and links
3. Check mobile responsiveness
4. Validate all content displays correctly

### Live Updates
1. Save your changes to JSON files
2. Upload to your hosting platform
3. Clear browser cache if needed
4. Test live site

## 💡 Pro Tips

### Content Strategy
- **Lead with impact**: Start descriptions with results
- **Be specific**: Use numbers and concrete examples
- **Tell a story**: Show your journey and growth
- **Stay current**: Regular updates keep content fresh

### Technical Tips
- **Backup first**: Always backup before major changes
- **Test locally**: Verify changes work before publishing
- **Use version control**: Track changes with Git
- **Validate JSON**: Use online JSON validators

### SEO Optimization
- Use descriptive project titles
- Include relevant keywords naturally
- Write compelling descriptions
- Keep content fresh and updated

---

**Remember**: The beauty of this system is that you only need to edit JSON files to update your entire website. No HTML or CSS knowledge required for content updates!
