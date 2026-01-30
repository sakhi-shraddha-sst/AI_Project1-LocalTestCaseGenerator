# Findings

## Research
- [x] Ollama API Capabilities 
- **Tools** `ollama` Python library, REST api 
- **Pattern** System instruction + few-shot prompting -> JSON output  
- **Models** Llama, Deepseek, Code Llama (local)

- [x] Test case generation patterns 
- **Structure** ID, category, test case name, test case description, test case steps, Expected results
 

## Constraints
- [x] Local environment only [Ollama] 
- [ ] Hardware dependent (RAM/GPU for larger models)
- [ ]JSON schema enforcement (require strict prompting or output parsers ) 