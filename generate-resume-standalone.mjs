import { compilePDF } from './resumake-mcp/lib/pdf-compiler.js';
import { generateLatex } from './resumake-mcp/lib/latex-generator.js';
import { expandTemplates } from './resumake-mcp/lib/template-expander.js';
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const resumePath = 'job-prep/applications/7ai-ai-engineer/resume-data.json';
    const outputDir = 'job-prep/applications/7ai-ai-engineer';
    const filename = 'vireshduvvuri_ai-engineer_7ai_2026-05-05.pdf';
    const outputPath = path.join(outputDir, filename);

    console.log(`Reading resume data from ${resumePath}...`);
    const resumeData = JSON.parse(await fs.readFile(resumePath, 'utf-8'));

    console.log('Expanding templates...');
    const expandedData = expandTemplates(resumeData);

    console.log('Generating LaTeX...');
    const latex = generateLatex(expandedData);

    console.log('Compiling PDF...');
    try {
        const pdfBuffer = await compilePDF(latex);
        await fs.writeFile(outputPath, pdfBuffer);
        console.log(`✅ Resume generated successfully at: ${outputPath}`);
    } catch (error) {
        console.error('❌ Failed to generate PDF:', error);
        process.exit(1);
    }
}

main();
