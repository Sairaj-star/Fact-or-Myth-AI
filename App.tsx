
import React, { useState, useCallback } from 'react';
import type { FactCheckResult } from './types';
import { factCheckClaim } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { GithubIcon } from './components/icons/GithubIcon';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FactCheckResult | null>(null);

  const handleFactCheck = useCallback(async (url: string, claim: string) => {
    if (!url.trim() || !claim.trim()) {
      setError("Please provide both a YouTube Shorts URL and the claim to check.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await factCheckClaim(url, claim);
      setResult(apiResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
            Fact or Myth AI
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Analyze claims from YouTube Shorts. Let AI separate fact from fiction.
          </p>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-900/20 p-6 sm:p-8 border border-slate-700">
          <InputForm onSubmit={handleFactCheck} isLoading={isLoading} />
          
          <div className="mt-8 min-h-[200px] flex items-center justify-center">
            {isLoading && <Loader />}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {result && <ResultDisplay result={result} />}
          </div>
        </main>
        
        <footer className="text-center mt-12 text-slate-500">
            <p>Powered by Google Gemini</p>
            <a href="https://github.com/google/generative-ai-docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-indigo-400 transition-colors mt-2">
                <GithubIcon />
                <span>View on GitHub</span>
            </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
