
import React from 'react';
import type { FactCheckResult } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface ResultDisplayProps {
  result: FactCheckResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const getVerdictChip = () => {
    if (result.isFact === true) {
      return (
        <span className="inline-block px-4 py-1.5 text-lg font-bold text-emerald-900 bg-emerald-300 rounded-full">
          FACT
        </span>
      );
    }
    if (result.isFact === false) {
      return (
        <span className="inline-block px-4 py-1.5 text-lg font-bold text-rose-900 bg-rose-300 rounded-full">
          MYTH
        </span>
      );
    }
    return (
      <span className="inline-block px-4 py-1.5 text-lg font-bold text-amber-900 bg-amber-300 rounded-full">
        INCONCLUSIVE
      </span>
    );
  };
  
  const verdictBorderColor = result.isFact === true ? 'border-emerald-500/50' : result.isFact === false ? 'border-rose-500/50' : 'border-amber-500/50';

  return (
    <div className={`w-full animate-fade-in space-y-6 p-6 bg-slate-800 rounded-lg border-t-4 ${verdictBorderColor}`}>
      <div className="flex items-center gap-4">
        {getVerdictChip()}
        <h2 className="text-2xl font-bold text-slate-100">Analysis Result</h2>
      </div>
      
      <div>
        <p className="text-slate-300 leading-relaxed">
          {result.explanation}
        </p>
      </div>

      {result.sources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Sources Found</h3>
          <ul className="space-y-2">
            {result.sources.map((source, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-indigo-400 pt-1"><LinkIcon /></span>
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors break-all"
                  title={source.title}
                >
                  {source.title || new URL(source.uri).hostname}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
