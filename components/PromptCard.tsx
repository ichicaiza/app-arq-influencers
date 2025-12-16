import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface PromptCardProps {
  title: string;
  prompt: string;
  index: number;
}

export const PromptCard: React.FC<PromptCardProps> = ({ title, prompt, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-pink-500/50 transition-colors duration-300 group">
      <div className="px-5 py-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-pink-400 uppercase tracking-wider flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-500/10 text-pink-500 text-xs">
            {index}
          </span>
          {title}
        </h3>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="Copy prompt"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-5">
        <p className="text-slate-300 leading-relaxed text-sm font-mono">
          {prompt}
        </p>
      </div>
      <div className="px-5 py-2 bg-black/20 text-xs text-slate-500 flex items-center gap-2">
         <Terminal size={12} /> Ready for Midjourney v6 / DALL-E 3
      </div>
    </div>
  );
};