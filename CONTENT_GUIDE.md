# Portfolio Website — Content Guide

All website content lives in `data/*.json`. Edit those files and refresh the browser — no HTML, CSS, or JS changes needed for content updates.

---

## File Map

| File | Controls |
|------|----------|
| `data/profile.json` | Name, tagline, contact links |
| `data/timeline.json` | Experience cards (Experience tab) + Education cards (Education tab) |
| `data/projects.json` | Project cards and detail pages (Projects tab) |
| `data/certificates.json` | Certification cards (Education tab, below education) |
| `css/main.css` `:root` block | All design tokens — colors, spacing, font sizes |

---

## data/profile.json

```json
{
  "name": "Your Name",
  "tagline": "Your one-line positioning statement",
  "contact": {
    "linkedin": "https://linkedin.com/in/your-handle/",
    "github": "https://github.com/your-handle",
    "email": "your@email.com"
  }
}
```

- `name` appears in the navbar (clicking it returns to About)
- `tagline` appears below the profile photo in the intro section
- `contact` links populate the social icon buttons in the navbar

---

## data/timeline.json

All entries live in a single `journey` array. The `type` field routes each entry to the correct tab.

### Career entry → Experience tab

```json
{
  "year": "MM/YYYY-MM/YYYY",
  "location": "City, State",
  "title": "Job Title",
  "company": "Company Name",
  "employmentType": "full-time",
  "type": "career",
  "description": "One-sentence summary shown on the card.",
  "responsibilities": [
    "Bullet shown on the card (keep to 3)",
    "Bullet 2",
    "Bullet 3"
  ],
  "detailedDescription": "Full HTML-safe paragraph for the detail page.",
  "detailedResponsibilities": [
    "Expanded bullet for detail page",
    "..."
  ],
  "skills": ["Python", "AWS", "LangChain"],
  "projects": [
    {
      "name": "Project display name",
      "description": "One-line description",
      "projectId": "matching-id-in-projects.json",
      "type": "featured",
      "hasContent": true
    }
  ]
}
```

**`employmentType` values:**
- `"full-time"` → green **Full-time** badge
- `"freelance"` → amber **Freelance** badge

The Experience tab has **All / Full-time / Freelance** filter buttons that use this field.

---

### Education entry → Education tab

```json
{
  "year": "YYYY-YYYY",
  "location": "City, State",
  "title": "Degree Title (shown if degree field absent)",
  "type": "education",
  "institution": "University Name",
  "degree": "Full Degree Name",
  "description": "One-paragraph summary shown on the card.",
  "thesis": "Thesis Title (optional — shown with document icon)",
  "advisor": "Dr. First Last, Title (optional — shown with person icon)",
  "projectId": "matching-id-in-projects.json (optional — makes card clickable)"
}
```

- If `projectId` is set, the card renders a **View Project** button and links to the project detail page.
- Education entries are **excluded** from the Experience tab automatically.

---

## data/projects.json

```json
{
  "projects": [
    {
      "id": "unique-slug",
      "title": "Project Title",
      "subtitle": "One-line subtitle shown in card header",
      "description": "2–3 sentence description shown in card body",
      "category": "AI Agents",
      "timeline": "2024-2025",
      "technologies": ["Python", "React", "AWS"],
      "impact": "Key metric or outcome",
      "videos": [
        {
          "title": "Video title",
          "url": "https://youtube.com/...",
          "description": "What the video shows"
        }
      ],
      "links": [
        {
          "title": "GitHub Repository",
          "url": "https://github.com/...",
          "description": "What the link is"
        }
      ],
      "details": {
        "overview": "Full description for the detail page.",
        "features": [
          "Feature 1",
          "Feature 2"
        ],
        "architecture": "Technical architecture description."
      }
    }
  ]
}
```

**`category` values drive the Projects page sections:**
- `"AI Agents"` → appears under the AI Agents section header
- `"Robotics"` → appears under the Robotics section header
- Any new category value automatically creates a new section — no code change needed.

Each card gets a **Learn More** button that opens the project detail page.

---

## data/certificates.json

```json
{
  "certificates": [
    {
      "id": "unique-slug",
      "title": "Certificate Name",
      "issuer": "Issuing Organization",
      "issueDate": "Month YYYY",
      "category": "Cloud",
      "description": "What this certification covers.",
      "skills": ["Skill 1", "Skill 2"],
      "credentialUrl": "https://..."
    }
  ]
}
```

Certificates render in the Education tab below the education cards.

---

## About page — static HTML

The About section content (tagline paragraph, intro description, featured project cards, About Me cards) lives directly in `index.html` — it is **not** data-driven. To reuse this template for a different person:

1. Edit `index.html` lines 51–65 — the two `<p class="intro-description">` paragraphs
2. Edit `index.html` lines 65–98 — the three `<div class="featured-proj-card">` entries
3. Edit `index.html` lines 109–125 — the four `<div class="about-card">` entries
4. Replace `profile-photo.jpg` with the new profile photo (same filename, or update the `src`)
5. Update the navbar `<span class="nav-name">` text

---

## Design tokens — changing the visual theme

All sizing, spacing, and color values are defined as CSS custom properties in `css/main.css` `:root`. Change these to retheme the entire site:

```css
:root {
  /* Brand colors */
  --accent-color: #38bdf8;       /* primary interactive color — buttons, badges, hovers */
  --bg-primary: #0f172a;         /* page background */
  --bg-card: #1e293b;            /* card backgrounds */
  --text-primary: #f1f5f9;       /* headings */
  --text-secondary: #cbd5e1;     /* body text */
  --text-muted: #94a3b8;         /* labels, meta, tags */
  --border-color: #334155;       /* card borders */

  /* Spacing & sizing tokens — touch these to adjust density */
  --pad-card: 1.5rem;            /* padding inside every card */
  --gap-grid: 1.25rem;           /* gap between cards in a grid */
  --gap-section: 2rem;           /* vertical space between page sections */
  --radius-card: 10px;           /* border-radius on top-level cards */
  --radius-inner: 6px;           /* border-radius on nested elements */
  --radius-tag: 4px;             /* border-radius on tags/badges */

  /* Typography tokens */
  --font-body: 0.875rem;         /* all card body text */
  --font-meta: 0.8rem;           /* section labels, meta info */
  --font-xs: 0.75rem;            /* tags, timestamps */
  --font-card-title: 1rem;       /* h3 headings inside cards */
  --font-section-label: 0.8rem;  /* in-page section headers */
  --accent-border: 3px;          /* left-accent border width */
}
```

---

## Adding a new tab / section

1. Add a `<a href="#" class="nav-link" data-section="your-section">Label</a>` to the navbar in `index.html`
2. Add `<section id="your-section" class="section">` to `index.html`
3. Add a render method in `js/main.js` and call it from `init()`
4. Use the `.section-label` class for any in-page section headers:
   ```html
   <div class="section-label">
     <i class="fas fa-icon-name"></i>
     <span>Section Title</span>
   </div>
   ```

---

## Section label pattern (design system rule)

Every in-page section header must use the `.section-label` class — this ensures uniform typography across all tabs:

```html
<div class="section-label">
  <i class="fas fa-robot"></i>
  <span>AI Agents</span>
</div>
```

Do **not** use `<h2>` tags or custom font sizes for section labels. All visual weight comes from the design tokens.

---

## Checklist for a new person's site

- [ ] Replace `profile-photo.jpg`
- [ ] Update `data/profile.json` — name, tagline, contact
- [ ] Replace `data/timeline.json` entries with their career + education history
- [ ] Replace `data/projects.json` with their projects
- [ ] Replace `data/certificates.json` with their certifications
- [ ] Edit About section static HTML in `index.html` (intro paragraphs, about cards, featured project cards)
- [ ] Update navbar `<span class="nav-name">` text
- [ ] Optionally retheme by editing `:root` color tokens in `css/main.css`
