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
  AlertCircle,
  Camera,
  RefreshCcw,
  ImageIcon
} from 'lucide-react';
import { InputGroup } from './components/InputGroup';
import { SelectionGroup } from './components/SelectionGroup';
import { PromptCard } from './components/PromptCard';
import { generateInfluencerImages } from './services/geminiService';
import { InfluencerParams, ImageGenerationResult, GenerationStatus } from './types';
import { DEFAULT_PARAMS, UI_OPTIONS } from './constants';

const App: React.FC = () => {
  // Local state for individual UI selections
  const [selections, setSelections] = useState({
    sex: '',
    age: '',
    hairColor: '',
    hairStyle: '',
    physique: '',
    extras: [] as string[],
    clothing: '',
    environment: '',
    camera: '',
    style: '',
    action: ''
  });

  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [results, setResults] = useState<ImageGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to handle single selections
  const handleSingleSelect = (key: keyof typeof selections) => (value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  // Helper to handle multi selections (Extras)
  const handleMultiSelect = (value: string) => {
    setSelections(prev => {
      const current = prev.extras;
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, extras: updated };
    });
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelections(prev => ({ ...prev, action: e.target.value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!selections.sex || !selections.clothing || !selections.environment) {
        setError("Please select at least Sex, Clothing, and Environment.");
        return;
    }

    setStatus(GenerationStatus.LOADING);
    setStatusMessage("Initializing...");
    setError(null);
    setResults(null);

    // Combine granular selections into the API format
    const apiParams: InfluencerParams = {
      sexAge: `${selections.sex}, ${selections.age || 'Young Adult'}`,
      physique: selections.physique,
      hair: `${selections.hairColor} ${selections.hairStyle}`,
      extras: selections.extras.join(', '),
      clothing: selections.clothing,
      environment: selections.environment,
      action: selections.action,
      style: `${selections.style}, ${selections.camera} Angle`,
    };

    try {
      const generatedImages = await generateInfluencerImages(apiParams, (msg) => setStatusMessage(msg));
      setResults(generatedImages);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError("Failed to generate images. Please check your API key.");
    }
  };

  const handleReset = () => {
    setSelections({
      sex: '',
      age: '',
      hairColor: '',
      hairStyle: '',
      physique: '',
      extras: [],
      clothing: '',
      environment: '',
      camera: '',
      style: '',
      action: ''
    });
    setResults(null);
    setStatus(GenerationStatus.IDLE);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-500 to-violet-600 p-2 rounded-lg shadow-lg shadow-pink-500/20">
              <ImageIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Influencer Architect
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">AI Image Generator</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RefreshCcw size={12} /> Reset
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Builder Interface */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50 space-y-6 shadow-xl backdrop-blur-sm">
              
              {/* Section 1: The Avatar */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">I. The Avatar</h3>
                
                <SelectionGroup
                  label="Sex / Gender"
                  options={UI_OPTIONS.sex}
                  selected={selections.sex}
                  onChange={handleSingleSelect('sex')}
                  icon={<User size={14} />}
                />
                
                <SelectionGroup
                  label="Age Range"
                  options={UI_OPTIONS.age}
                  selected={selections.age}
                  onChange={handleSingleSelect('age')}
                />

                <SelectionGroup
                  label="Physique"
                  options={UI_OPTIONS.physique}
                  selected={selections.physique}
                  onChange={handleSingleSelect('physique')}
                  icon={<Dumbbell size={14} />}
                />
              </div>

              {/* Section 2: Look & Style */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">II. The Look</h3>

                <div className="grid grid-cols-2 gap-4">
                  <SelectionGroup
                    label="Hair Color"
                    options={UI_OPTIONS.hairColor}
                    selected={selections.hairColor}
                    onChange={handleSingleSelect('hairColor')}
                    icon={<Palette size={14} />}
                  />
                  <SelectionGroup
                    label="Hair Style"
                    options={UI_OPTIONS.hairStyle}
                    selected={selections.hairStyle}
                    onChange={handleSingleSelect('hairStyle')}
                    icon={<Scissors size={14} />}
                  />
                </div>

                <SelectionGroup
                  label="Clothing Style"
                  options={UI_OPTIONS.clothing}
                  selected={selections.clothing}
                  onChange={handleSingleSelect('clothing')}
                  icon={<Shirt size={14} />}
                />

                <SelectionGroup
                  label="Distinguishing Extras"
                  options={UI_OPTIONS.extras}
                  selected={selections.extras}
                  onChange={handleMultiSelect}
                  multiSelect
                  icon={<Sparkles size={14} />}
                />
              </div>

              {/* Section 3: The Scene */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2">III. The Scene</h3>
                
                <SelectionGroup
                  label="Environment"
                  options={UI_OPTIONS.environment}
                  selected={selections.environment}
                  onChange={handleSingleSelect('environment')}
                  icon={<MapPin size={14} />}
                />

                <SelectionGroup
                  label="Art Style"
                  options={UI_OPTIONS.style}
                  selected={selections.style}
                  onChange={handleSingleSelect('style')}
                  icon={<Palette size={14} />}
                />

                <SelectionGroup
                  label="Camera Angle"
                  options={UI_OPTIONS.camera}
                  selected={selections.camera}
                  onChange={handleSingleSelect('camera')}
                  icon={<Camera size={14} />}
                />

                <div className="pt-2">
                  <InputGroup
                    label="Current Action (Be creative!)"
                    name="action"
                    value={selections.action}
                    onChange={handleActionChange}
                    placeholder="e.g. Sipping a matcha latte while reading a book..."
                    icon={<Clapperboard size={14} />}
                    isTextArea
                  />
                </div>
              </div>

              <div className="pt-4 sticky bottom-0 z-10">
                <button
                  onClick={handleSubmit}
                  disabled={status === GenerationStatus.LOADING}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl transform hover:scale-[1.02]
                    ${status === GenerationStatus.LOADING 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white shadow-purple-500/25'
                    }`}
                >
                  {status === GenerationStatus.LOADING ? (
                    <>
                      <Loader2 className="animate-spin" /> {statusMessage || 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} /> Generate 5 Images
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
             <div className="space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold text-white flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span>
                     Visual Output
                   </h2>
                   {status === GenerationStatus.SUCCESS && (
                     <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                       Success
                     </span>
                   )}
                </div>
                
                {status === GenerationStatus.IDLE && (
                  <div className="h-[600px] border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500 bg-slate-800/20">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">Ready to Visualize</p>
                    <p className="text-sm opacity-60">Select options to generate 5 unique shots</p>
                  </div>
                )}

                {status === GenerationStatus.LOADING && (
                   <div className="h-[600px] flex flex-col items-center justify-center space-y-6 bg-slate-800/20 rounded-2xl border border-slate-700/50">
                     <div className="relative">
                       <div className="w-20 h-20 border-4 border-slate-700 border-t-pink-500 rounded-full animate-spin"></div>
                       <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-b-violet-500 rounded-full animate-spin-reverse"></div>
                     </div>
                     <div className="text-center space-y-2">
                        <p className="text-white font-medium animate-pulse text-lg">{statusMessage}</p>
                        <p className="text-slate-500 text-xs font-mono">This may take up to 20 seconds</p>
                     </div>
                   </div>
                )}

                {status === GenerationStatus.SUCCESS && results && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="md:col-span-1">
                      <PromptCard 
                        index={1}
                        title="Full Body Shot"
                        data={results.fullBody}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <PromptCard 
                        index={2}
                        title="Extreme Close-Up"
                        data={results.extremeCloseUp}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <PromptCard 
                        index={3}
                        title="View From Behind"
                        data={results.viewFromBehind}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <PromptCard 
                        index={4}
                        title="Side Profile"
                        data={results.sideProfile}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <PromptCard 
                        index={5}
                        title="Action Shot (Cinematic)"
                        data={results.actionShot}
                      />
                    </div>
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