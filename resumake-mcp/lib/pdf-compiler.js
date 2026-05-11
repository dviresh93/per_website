/**
 * PDF Compiler
 * Compiles LaTeX code to PDF using pdflatex
 */

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

/**
 * Compile LaTeX code to PDF
 * @param {string} latexCode - The LaTeX source code
 * @returns {Promise<Buffer>} - The compiled PDF as a buffer
 */
export async function compilePDF(latexCode) {
  // Create temporary directory
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "resume-"));
  const texFile = path.join(tmpDir, "resume.tex");
  const pdfFile = path.join(tmpDir, "resume.pdf");

  try {
    // Write LaTeX to file
    await fs.writeFile(texFile, latexCode, "utf8");

    // Compile with pdflatex (run twice for proper formatting)
    await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${tmpDir}" "${texFile}"`, {
      cwd: tmpDir,
    });

    // Run second time to resolve references
    await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${tmpDir}" "${texFile}"`, {
      cwd: tmpDir,
    });

    // Read the generated PDF
    const pdfBuffer = await fs.readFile(pdfFile);

    return pdfBuffer;
  } catch (error) {
    // Try to read log file for debugging
    try {
      const logFile = path.join(tmpDir, "resume.log");
      const logContent = await fs.readFile(logFile, "utf8");
      console.error("LaTeX compilation error:", logContent);
    } catch (logError) {
      // Log file might not exist
    }

    throw new Error(`PDF compilation failed: ${error.message}`);
  } finally {
    // Cleanup temporary files
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error("Failed to cleanup temp directory:", cleanupError);
    }
  }
}

/**
 * Test if pdflatex is available
 */
export async function testPdfLatex() {
  try {
    const cmd = process.platform === "win32" ? "where pdflatex" : "which pdflatex";
    await execAsync(cmd);
    return true;
  } catch (error) {
    return false;
  }
}
