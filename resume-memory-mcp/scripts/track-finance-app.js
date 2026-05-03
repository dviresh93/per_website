#!/usr/bin/env node

import { initDatabase, trackApplication } from '../lib/database.js';

const db = initDatabase();

trackApplication(db, {
  id: 'finance-smart-assistant-tampa-ds',
  company: 'Finance Smart Assistant (Tampa)',
  role: 'Senior Data Scientist - Generative AI',
  role_type: 'ai_engineer',
  job_requirements: 'Generative AI, RAG, LangChain, LlamaIndex, LLMs, Vector databases, Agentic AI, Prompt engineering, Fine-tuning, Python, MLOps, Finance domain, Document & data inquiry, Table transformers, Model evaluation, Fine-tuning techniques, Cloud platforms',
  projects_selected: JSON.stringify(['GridCOP: Multi-Agent AI System', 'AI-Powered Drone Log Analysis', 'PX4 Flight Control Systems']),
  skills_highlighted: JSON.stringify(['LangChain', 'RAG', 'Agentic AI', 'Multi-agent Systems', 'Python', 'AWS', 'MLOps', 'Vector databases', 'FAISS']),
  resume_path: '/home/virus/Documents/generated-resumes/finance-smart-assistant-senior-ds/resume-2025-11-10.pdf',
  resume_json: null,
  resume_reused: false,
  tokens_used: 7500,
  cost_usd: 0.09,
  status: 'applied',
  similarity_score: null
});

console.log('✅ Finance Smart Assistant application tracked successfully!');
db.close();
