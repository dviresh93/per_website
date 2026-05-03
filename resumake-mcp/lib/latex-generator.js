/**
 * LaTeX Resume Generator
 * Converts resume JSON data to LaTeX code
 */

export function generateLatex(resumeData) {
  const { basics, work, education, skills, projects } = resumeData;
  const headings = resumeData.headings || {};

  let latex = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{lato}
\\renewcommand*\\familydefault{\\sfdefault}
\\usepackage[T1]{fontenc}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\color{black!70}\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black!50}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\color{black!60}#2 \\\\
      \\color{black!70}\\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING----------
\\begin{center}
    {\\huge\\bfseries ${escapeLatex(basics.name)}} \\\\ \\vspace{1pt}
    \\footnotesize\\textit{${escapeLatex(basics.location?.address || "")} $|$ ${escapeLatex(basics.phone)} $|$ \\href{mailto:${basics.email}}{${basics.email}} $|$
    \\href{https://${basics.website}}{${basics.website}}}
\\end{center}

`;

  // Add summary/label if provided
  if (basics.label || basics.summary) {
    latex += `%----------SUMMARY----------\n`;
    if (basics.label) {
      latex += `\\vspace{-10pt}\n\\begin{center}\n    {\\large\\color{black!70} ${escapeLatex(basics.label)}}\n\\end{center}\n`;
    }
    if (basics.summary) {
      latex += `\\vspace{-5pt}\n\\small{${escapeLatex(basics.summary)}}\n\\vspace{5pt}\n\n`;
    }
  }

  // Skills (moved above work experience)
  if (skills && skills.length > 0) {
    latex += `%-----------SKILLS-----------\n`;
    latex += `\\section{${headings.skills || "Skills"}}\n`;
    latex += ` \\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    latex += `    \\small{\\item{\n`;

    skills.forEach((skillGroup, index) => {
      const keywords = skillGroup.keywords.map(escapeLatex).join(", ");
      latex += `     \\textbf{${escapeLatex(skillGroup.name)}: }${keywords}`;
      if (index < skills.length - 1) {
        latex += ` \\\\[3pt]\n`;
      } else {
        latex += `\n`;
      }
    });

    latex += `    }}\n \\end{itemize}\n\n`;
  }

  // Work Experience (moved below skills)
  if (work && work.length > 0) {
    latex += `%-----------EXPERIENCE-----------\n`;
    latex += `\\section{${headings.work || "Work Experience"}}\n`;
    latex += `  \\resumeSubHeadingListStart\n`;

    work.forEach((job) => {
      latex += `    \\resumeSubheading\n`;
      latex += `      {${escapeLatex(job.company)}}{${escapeLatex(job.location)}}\n`;
      latex += `      {${escapeLatex(job.position)}}{${escapeLatex(job.startDate)} - ${escapeLatex(job.endDate)}}\n`;

      if (job.highlights && job.highlights.length > 0) {
        latex += `      \\resumeItemListStart\n`;
        job.highlights.forEach((highlight) => {
          latex += `        \\resumeItem{${escapeLatex(highlight)}}\n`;
        });
        latex += `      \\resumeItemListEnd\n`;
      }
    });

    latex += `  \\resumeSubHeadingListEnd\n\n`;
  }

  // Education
  if (education && education.length > 0) {
    latex += `%-----------EDUCATION-----------\n`;
    latex += `\\section{${headings.education || "Education"}}\n`;
    latex += `  \\resumeSubHeadingListStart\n`;

    education.forEach((edu) => {
      latex += `    \\resumeSubheading\n`;
      latex += `      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}\n`;
      latex += `      {${escapeLatex(edu.studyType)} ${escapeLatex(edu.area)}}{${escapeLatex(edu.startDate)} - ${escapeLatex(edu.endDate)}}\n`;
    });

    latex += `  \\resumeSubHeadingListEnd\n\n`;
  }

  // Projects with bullet point support
  if (projects && projects.length > 0) {
    latex += `%-----------PROJECTS-----------\n`;
    latex += `\\section{${headings.projects || "Projects"}}\n`;
    latex += `    \\resumeSubHeadingListStart\n`;

    projects.forEach((project) => {
      latex += `      \\resumeProjectHeading\n`;
      latex += `          {\\textbf{${escapeLatex(project.name)}}}{}\n`;

      // Use highlights if provided, otherwise fall back to description
      if (project.highlights && project.highlights.length > 0) {
        latex += `          \\resumeItemListStart\n`;
        project.highlights.forEach((highlight) => {
          latex += `            \\resumeItem{${escapeLatex(highlight)}}\n`;
        });
        latex += `          \\resumeItemListEnd\n`;
      } else if (project.description) {
        latex += `          \\resumeItemListStart\n`;
        latex += `            \\resumeItem{${escapeLatex(project.description)}}\n`;
        latex += `          \\resumeItemListEnd\n`;
      }
    });

    latex += `    \\resumeSubHeadingListEnd\n\n`;
  }

  latex += `\\end{document}\n`;

  return latex;
}

/**
 * Escape special LaTeX characters
 */
function escapeLatex(text) {
  if (!text) return "";

  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/\\textbackslash\{\}/g, "\\textbackslash{}");
}
