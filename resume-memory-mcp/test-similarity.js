#!/usr/bin/env node

/**
 * Test Similarity Check
 * Quick test to verify the similarity API is working
 */

import { initDatabase } from './lib/database.js';
import { checkSimilarity } from './lib/similarity-checker.js';

async function test() {
  console.log('Testing similarity check...\n');

  const db = initDatabase();

  const testJob = {
    company: 'Test AI Company',
    role: 'AI Engineer',
    requirements: 'Build agentic AI systems using LangChain, LangGraph, multi-agent coordination, RAG systems, and prompt engineering',
    threshold: 0.8
  };

  console.log('Test Job:', testJob);
  console.log('\nCalling API...\n');

  const result = await checkSimilarity(db, testJob);

  console.log('Result:', JSON.stringify(result, null, 2));

  db.close();
}

test().catch(console.error);
