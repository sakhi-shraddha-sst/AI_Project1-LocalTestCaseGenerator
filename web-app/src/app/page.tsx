
'use client';

import { useState } from 'react';

interface TestCase {
  id: string;
  category: string;
  name: string;
  description: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[] | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setTestCases(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.testCases) {
        setTestCases(data.testCases);
      } else {
        throw new Error('Invalid response format from generator');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: Add a toast notification here
  };

  const handleExportJSON = () => {
    if (!testCases) return;
    const blob = new Blob([JSON.stringify({ testCases }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-cases.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    if (!testCases) return;
    let md = '# Generated Test Cases\n\n';
    testCases.forEach(tc => {
      md += `## ${tc.id}: ${tc.name}\n`;
      md += `**Category:** ${tc.category}\n\n`;
      md += `**Description:** ${tc.description}\n\n`;
      md += `**Preconditions:** ${tc.preconditions}\n\n`;
      md += `**Steps:**\n`;
      tc.steps.forEach((s, i) => md += `${i + 1}. ${s}\n`);
      md += `\n**Expected Result:** ${tc.expectedResult}\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-cases.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-sm text-slate-400 mb-4">
            Powered by Llama 3.2
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent pb-2">
            Local Test Case Generator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Transform user requirements into comprehensive, structured test cases instantly.
            Running 100% locally on your machine.
          </p>
        </header>

        {/* Input Section */}
        <section className="max-w-3xl mx-auto mb-16">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Describe your feature or requirement
            </label>
            <textarea
              className="w-full h-32 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
              placeholder="E.g., A login page where the user can log in with clear text credentials, but it locks the account after 3 failed attempts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className={`
                  px-6 py-3 rounded-xl font-medium text-white transition-all transform active:scale-95
                  ${loading
                    ? 'bg-slate-800 cursor-not-allowed text-slate-500'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}
                `}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Test Cases'
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-12 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Results Section */}
        {testCases && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-semibold text-white">Generated Test Cases <span className="text-slate-500 text-lg font-normal ml-2">({testCases.length})</span></h2>
              <div className="flex gap-2">
                <button onClick={handleExportJSON} className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors">
                  Export JSON
                </button>
                <button onClick={handleExportMarkdown} className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors">
                  Export Markdown
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {testCases.map((tc) => (
                <div
                  key={tc.id}
                  className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-slate-700/80 rounded-xl p-6 transition-all hover:bg-slate-900/60"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-mono text-slate-400 border border-slate-700">
                        {tc.id}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${tc.category.toLowerCase().includes('edge') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        tc.category.toLowerCase().includes('security') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                        {tc.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(JSON.stringify(tc, null, 2))}
                      className="text-slate-500 hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                  </div>

                  <h3 className="text-lg font-medium text-slate-200 mb-2">{tc.name}</h3>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed">{tc.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Test Steps</div>
                      <ol className="space-y-2">
                        {tc.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-300">
                            <span className="text-slate-600 font-mono text-xs mt-0.5">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Preconditions</div>
                        <p className="text-sm text-slate-400 bg-slate-950/30 p-3 rounded-lg border border-slate-800/50">
                          {tc.preconditions}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Expected Result</div>
                        <p className="text-sm text-indigo-300/80 bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/10">
                          {tc.expectedResult}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
