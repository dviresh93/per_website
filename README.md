# Viresh Duvvuri - Portfolio Website

A modern, responsive portfolio website showcasing your journey from robotics to AI agent development. Built with vanilla HTML, CSS, and JavaScript for maximum performance and easy maintenance.

## 🚀 Quick Start

1. **Open the website**: Simply open `index.html` in your browser
2. **Local server** (recommended): Use a local server for best experience
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## 📁 Project Structure

```
per_wesite/
├── index.html              # Main HTML file
├── css/
│   ├── main.css           # Core styles and layout
│   ├── components.css     # Component-specific styles
│   └── responsive.css     # Mobile and responsive styles
├── js/
│   ├── main.js           # Main application logic
│   ├── projects.js       # Project management functionality
│   └── timeline.js       # Timeline interactions
├── data/
│   ├── profile.json      # Personal information
│   ├── skills.json       # Skills and technologies
│   ├── timeline.json     # Career timeline
│   └── projects.json     # Project details
└── README.md             # This file
```

## ✏️ Easy Content Management

### 1. Update Personal Information
Edit `data/profile.json`:
```json
{
  "name": "Your Name",
  "tagline": "Your Professional Tagline",
  "subtitle": "Your Role | Specialty | Focus",
  "description": "Brief description of your transition journey",
  "profileImage": "Your Initials",
  "contact": {
    "linkedin": "https://linkedin.com/in/your-profile/",
    "github": "https://github.com/your-username",
    "email": "your.email@example.com"
  }
}
```

### 2. Update Skills
Edit `data/skills.json`:
```json
{
  "categories": [
    {
      "name": "Category Name",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ]
}
```

### 3. Update Career Timeline
Edit `data/timeline.json`:
```json
{
  "journey": [
    {
      "year": "2024-Present",
      "title": "Your Current Role",
      "description": "What you do and your impact",
      "projects": [
        {
          "name": "Project Name",
          "description": "Brief project description"
        }
      ]
    }
  ]
}
```

### 4. Add/Update Projects
Edit `data/projects.json`:
```json
{
  "projects": [
    {
      "id": "unique-project-id",
      "title": "Project Title",
      "subtitle": "Project Subtitle",
      "description": "Brief project description",
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "impact": "What impact did this project have?",
      "timeline": "When was this project completed?",
      "category": "AI Agents", // or "Robotics", "Automation"
      "details": {
        "overview": "Detailed project overview",
        "features": ["Feature 1", "Feature 2"],
        "approach": "Technical approach used",
        "challenges": "Challenges faced and solutions",
        "results": "Results and impact achieved"
      }
    }
  ]
}
```

## 🎨 Customization

### Colors and Theme
Edit CSS variables in `css/main.css`:
```css
:root {
  --primary-color: #667eea;      /* Main brand color */
  --secondary-color: #764ba2;    /* Secondary color */
  --accent-color: #f093fb;       /* Accent color */
  --text-primary: #2d3748;       /* Main text color */
  --text-secondary: #4a5568;     /* Secondary text color */
  /* ... more variables */
}
```

### Fonts
Change the font in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Layout
- **Sidebar width**: Change `width: 350px` in `.sidebar` (css/main.css)
- **Content spacing**: Adjust padding values in `.content-area`
- **Navigation**: Modify `.nav-links` gap for spacing

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🔧 Advanced Features

### Adding New Sections
1. Add HTML structure in `index.html`
2. Add CSS styles in appropriate CSS file
3. Add JavaScript functionality in `js/main.js`

### Dynamic Content Loading
The website automatically loads content from JSON files. No need to edit HTML for content changes.

### Project Filtering
Projects are automatically filtered by category. Add new categories by updating the filter buttons in `index.html`.

## 🚀 Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Netlify
1. Connect your GitHub repository to Netlify
2. Deploy automatically on every push
3. Get a custom domain and SSL certificate

### Vercel
1. Import your GitHub repository to Vercel
2. Deploy with zero configuration
3. Get automatic deployments and previews

## 🛠️ Maintenance Tips

### Regular Updates
- **Monthly**: Review and update project descriptions
- **Quarterly**: Add new projects and update timeline
- **As needed**: Update skills and contact information

### Performance
- Images: Optimize images before adding (use tools like TinyPNG)
- Fonts: Only load necessary font weights
- Code: Minify CSS/JS for production (optional)

### SEO
- Update page title in `index.html`
- Add meta descriptions
- Use semantic HTML structure (already implemented)

## 🐛 Troubleshooting

### Common Issues

**Content not loading:**
- Check JSON file syntax (use JSON validator)
- Ensure file paths are correct
- Check browser console for errors

**Styling issues:**
- Clear browser cache
- Check CSS file paths
- Validate CSS syntax

**JavaScript errors:**
- Check browser console
- Ensure all JS files are loaded
- Verify JSON data structure

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📞 Support

For questions or issues:
1. Check this README first
2. Review the code comments
3. Check browser console for errors
4. Validate JSON files

## 🎯 Future Enhancements

Potential features to add:
- [ ] Blog section
- [ ] Contact form
- [ ] Dark mode toggle
- [ ] Search functionality
- [ ] Analytics integration
- [ ] Multi-language support

---

**Built with ❤️ for easy maintenance and professional presentation**
