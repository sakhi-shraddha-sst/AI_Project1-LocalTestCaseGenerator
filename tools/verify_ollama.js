
async function checkOllama() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('✅ Ollama Connection Verified!');
    console.log('Available Models:', data.models.map(m => m.name).join(', '));
    
    // Check for llama3.2 specifically
    const hasLlama = data.models.some(m => m.name.includes('llama3.2'));
    if (hasLlama) {
        console.log('✅ Llama 3.2 is present.');
    } else {
        console.error('❌ Llama 3.2 is MISSING. Please run: ollama pull llama3.2');
        process.exit(1);
    }

  } catch (error) {
    console.error('❌ Failed to connect to Ollama:', error.message);
    console.error('Ensure Ollama is running at http://localhost:11434');
    process.exit(1);
  }
}

checkOllama();
