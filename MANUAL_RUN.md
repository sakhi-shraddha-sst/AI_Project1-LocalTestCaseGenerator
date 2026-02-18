# Manual Run Instructions

Follow these steps to manually set up and run the Local Test Case Generator.

## 1. Prerequisites
Ensure you have the following installed:
- **Ollama**: [Download Ollama](https://ollama.com/)
- **Node.js** (v18+): [Download Node.js](https://nodejs.org/)

## 2. Start Ollama and Model Setup
Open your terminal and run the following commands to ensure Ollama is serving the correct model.

```bash
# 1. Start the Ollama server (if not already running)
ollama serve

# 2. Open a new terminal tab/window and pull the required model (Llama 3.2)
# Note: This checks if the model exists and downloads it if missing.
ollama pull llama3.2
```

## 3. Web Application Setup
Prepare the frontend application.

```bash
# 1. Navigate to the web-app directory
cd web-app

# 2. Install Node.js dependencies
npm install
```

## 4. Launch the Application
Start the Next.js development server.

```bash
# Start the development server
npm run dev
```

## 5. Access the App
Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)
