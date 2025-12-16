import React, { useState } from 'react';
import { Copy, Check, Download, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { GeneratedImage } from '../types';

interface PromptCardProps {
  title: string;
  data: GeneratedImage;
  index: number;
}

export const PromptCard: React.FC<PromptCardProps> = ({ title, data, index }) => {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!data.imageData) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${data.imageData}`;
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-pink-500/50 transition-all duration-300 group flex flex-col h-full shadow-lg">
      <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center backdrop-blur-sm z-10">
        <h3 className="text-sm font-semibold text-pink-400 uppercase tracking-wider flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-500/10 text-pink-500 text-xs">
            {index}
          </span>
          {title}
        </h3>
        <div className="text-xs text-slate-500 font-mono bg-slate-900/50 px-2 py-0.5 rounded">
          {data.aspectRatio}
        </div>
      </div>

      <div className="relative aspect-auto group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all bg-slate-900 flex items-center justify-center min-h-[300px]">
        {data.imageData ? (
          <img 
            src={`data:image/png;base64,${data.imageData}`} 
            alt={title}
            className="w-full h-auto object-contain max-h-[500px]"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600 p-10">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <p className="text-sm">Image generation failed</p>
          </div>
        )}
        
        {/* Overlay Actions */}
        {data.imageData && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="p-2 bg-slate-800/90 text-white rounded-lg hover:bg-pink-600 transition-colors backdrop-blur-md"
                title="View Prompt"
              >
                <Maximize2 size={18} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-slate-800/90 text-white rounded-lg hover:bg-green-600 transition-colors backdrop-blur-md"
                title="Download Image"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Prompt Text */}
      <div className={`border-t border-slate-700 bg-slate-900/50 transition-all duration-300 ${showPrompt ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
        <div className="p-4">
           <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-bold text-slate-500 uppercase">Prompt Used</span>
             <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white transition-colors"
                title="Copy prompt"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
           </div>
           <p className="text-xs text-slate-400 font-mono leading-relaxed max-h-40 overflow-y-auto pr-2">
             {data.prompt}
           </p>
        </div>
      </div>
      
      {!showPrompt && data.imageData && (
        <button 
          onClick={() => setShowPrompt(true)}
          className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors border-t border-slate-800"
        >
          View Prompt Details
        </button>
      )}
    </div>
  );
};