
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are an expert QA Automation Engineer.
Your task is to analyze the following User Requirement and generate a comprehensive set of test cases.

### Output Format
You MUST output the test cases in the following JSON format:
{
  "testCases": [
    {
      "id": "TC_001",
      "category": "Functional|Edge Case|Security|Performance",
      "name": "Short descriptive name",
      "description": "What is being tested",
      "preconditions": "Any setup required",
      "steps": ["Step 1", "Step 2"],
      "expectedResult": "Expected outcome"
    }
  ]
}

### Behavioral Rules
1. **Deterministic IDs**: Always start with TC_001 and increment.
2. **Coverage**: Include at least one Positive, one Negative, and one Edge Case scenario.
3. **Clarity**: Write steps in clear, imperative English.
4. **No Fluff**: Do not include any text before or after the JSON block.
`;

export async function POST(request: Request) {
    try {
        const { input } = await request.json();

        if (!input) {
            return NextResponse.json({ error: 'Input is required' }, { status: 400 });
        }

        const payload = {
            model: 'llama3.2',
            prompt: `${SYSTEM_PROMPT}\n\nUser Requirement: ${input}`,
            format: 'json',
            stream: false,
        };

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Parse the inner JSON from Ollama's response
        let parsedResult;
        try {
            parsedResult = JSON.parse(data.response);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            return NextResponse.json({ error: 'Failed to parse LLM response', raw: data.response }, { status: 500 });
        }

        return NextResponse.json(parsedResult);

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
