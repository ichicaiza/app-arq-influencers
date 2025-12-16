import React, { useState } from 'react';
import { 
  Wand2, 
  User, 
  Dumbbell, 
  Scissors, 
  Sparkles, 
  Shirt, 
  MapPin, 
  Clapperboard, 
  Palette,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { InputGroup } from './components/InputGroup';
import { PromptCard } from './components/PromptCard';
import { generatePrompts } from './services/geminiService';
import { InfluencerParams, PromptOutput, GenerationStatus } from './types';
import { DEFAULT_PARAMS } from './constants';

const App: React.FC = () => {
  const [params, setParams] = useState<InfluencerParams>(DEFAULT_PARAMS);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [results, setResults] = useState<PromptOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!params.sexAge || !params.clothing || !params.environment) {
        setError("Please fill in at least Sex/Age, Clothing, and Environment to get good results.");
        return;
    }

    setStatus(GenerationStatus.LOADING);
    setError(null);
    setResults(null);

    try {
      const generatedPrompts = await generatePrompts(params);
      setResults(generatedPrompts);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError("Failed to generate prompts. Please check your API key or try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-500 to-violet-600 p-2 rounded-lg">
              <Wand2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Prompt Architect
              </h1>
              <p className="text-xs text-slate-500 font-medium">Virtual Influencer Edition</p>
            </div>
          </div>
          <div className="text-xs font-mono text-slate-500 border border-slate-800 px-3 py-1 rounded-full">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Character Parameters</h2>
              <p className="text-slate-400 text-sm">Define your virtual influencer's attributes below.</p>
            </div>

            <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 space-y-5 shadow-xl">
              <InputGroup
                label="Sex / Age"
                name="sexAge"
                value={params.sexAge}
                onChange={handleChange}
                placeholder="e.g. Woman, 25 years old"
                icon={<User size={16} />}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Physique"
                  name="physique"
                  value={params.physique}
                  onChange={handleChange}
                  placeholder="e.g. Athletic, Curvy"
                  icon={<Dumbbell size={16} />}
                />
                <InputGroup
                  label="Hair"
                  name="hair"
                  value={params.hair}
                  onChange={handleChange}
                  placeholder="e.g. Platinum bob"
                  icon={<Scissors size={16} />}
                />
              </div>

              <InputGroup
                label="Extras (Features)"
                name="extras"
                value={params.extras}
                onChange={handleChange}
                placeholder="e.g. Nose piercing, freckles"
                icon={<Sparkles size={16} />}
              />

              <InputGroup
                label="Clothing"
                name="clothing"
                value={params.clothing}
                onChange={handleChange}
                placeholder="e.g. Cyberpunk tech-wear jacket"
                icon={<Shirt size={16} />}
              />

              <InputGroup
                label="Environment"
                name="environment"
                value={params.environment}
                onChange={handleChange}
                placeholder="e.g. Tokyo neon streets at night"
                icon={<MapPin size={16} />}
              />

              <InputGroup
                label="Action"
                name="action"
                value={params.action}
                onChange={handleChange}
                placeholder="e.g. Eating ramen and laughing"
                icon={<Clapperboard size={16} />}
              />

              <InputGroup
                label="General Style"
                name="style"
                value={params.style}
                onChange={handleChange}
                placeholder="e.g. 8k, Photorealism, Cinematic"
                icon={<Palette size={16} />}
                isTextArea
              />

              <button
                onClick={handleSubmit}
                disabled={status === GenerationStatus.LOADING}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                  ${status === GenerationStatus.LOADING 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white hover:shadow-pink-500/25'
                  }`}
              >
                {status === GenerationStatus.LOADING ? (
                  <>
                    <Loader2 className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} /> Generate Prompts
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-bold text-white">Generated Prompts</h2>
                   {status === GenerationStatus.SUCCESS && (
                     <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">
                       Generation Complete
                     </span>
                   )}
                </div>
                
                {status === GenerationStatus.IDLE && (
                  <div className="h-[600px] border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                    <Wand2 size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">Ready to create</p>
                    <p className="text-sm opacity-60">Fill the form and hit generate</p>
                  </div>
                )}

                {status === GenerationStatus.LOADING && (
                   <div className="h-[600px] flex flex-col items-center justify-center space-y-4">
                     <div className="relative">
                       <div className="w-16 h-16 border-4 border-slate-700 border-t-pink-500 rounded-full animate-spin"></div>
                       <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-b-violet-500 rounded-full animate-spin-reverse"></div>
                     </div>
                     <p className="text-slate-400 animate-pulse">Designing your influencer...</p>
                   </div>
                )}

                {status === GenerationStatus.SUCCESS && results && (
                  <div className="space-y-6 animate-fade-in">
                    <PromptCard 
                      index={1}
                      title="Full Body Shot"
                      prompt={results.fullBody}
                    />
                    <PromptCard 
                      index={2}
                      title="Extreme Close-Up"
                      prompt={results.extremeCloseUp}
                    />
                    <PromptCard 
                      index={3}
                      title="View From Behind"
                      prompt={results.viewFromBehind}
                    />
                    <PromptCard 
                      index={4}
                      title="Side Profile"
                      prompt={results.sideProfile}
                    />
                    <PromptCard 
                      index={5}
                      title="Action Shot"
                      prompt={results.actionShot}
                    />
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;