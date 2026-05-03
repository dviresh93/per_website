// Test fetch from Node.js to similarity API
const testFetch = async () => {
  try {
    console.log('Testing fetch to http://127.0.0.1:8001/check_similarity...');
    
    const response = await fetch('http://127.0.0.1:8001/check_similarity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: "Test Company",
        role_type: "ai_engineer",
        requirements: "Build AI systems with LangChain"
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const result = await response.json();
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Stack:', error.stack);
  }
};

testFetch();
