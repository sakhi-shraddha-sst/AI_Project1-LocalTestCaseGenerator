# API Logic SOP

## Endpoint
`POST /api/generate`

## Flow
1. **Receive Request**:
    - Body: `{ input: string }`
2. **Load Context**:
    - Read `system_prompt` (defined in code based on `architecture/system_prompt.md`).
3. **Call Ollama**:
    - URL: `http://localhost:11434/api/generate`
    - Model: `llama3.2`
    - Prompt: `System Prompt` + `User Input`
    - Format: `json` (Force JSON mode for reliability)
    - Stream: `false` (Simpler for V1)
4. **Parse & Return**:
    - Extract JSON from response.
    - Return to UI: `{ testCases: [] }`

## Error Handling
- If Ollama is down -> Return 503 "Ollama Service Unavailable".
- If JSON parse fails -> Return 500 "Malformed LLM Response".
