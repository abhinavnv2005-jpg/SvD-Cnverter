
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { SvgDisplay } from './components/SvgDisplay';
import { SpinnerIcon } from './components/icons';
import { generateSvg } from './services/geminiService';
import type { UploadedFile } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a concept description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedSvg(null);

    try {
      const svgCode = await generateSvg(prompt, images);
      setGeneratedSvg(svgCode);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, images]);
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Control Panel */}
        <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg flex flex-col gap-6 sticky top-6 ring-1 ring-slate-700">
            <h2 className="text-2xl font-bold text-cyan-400">1. Describe Your Concept</h2>
            <div className="flex flex-col gap-2">
                <label htmlFor="prompt-input" className="text-sm font-medium text-slate-400">
                    Enter a detailed description of the SVG you want to create.
                </label>
                <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A minimalist logo of a mountain range at sunrise, with a soaring eagle."
                    className="w-full bg-slate-900/80 border-slate-700 border rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 min-h-[120px] placeholder-slate-500"
                    rows={4}
                />
            </div>
            
            <h2 className="text-2xl font-bold text-cyan-400">2. Add Inspiration (Optional)</h2>
            <ImageUploader files={images} setFiles={setImages} />
            
            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:shadow-none"
            >
                {isLoading ? (
                    <>
                        <SpinnerIcon />
                        Generating...
                    </>
                ) : (
                    'Generate SVG'
                )}
            </button>
            {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        </div>

        {/* Output Area */}
        <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg flex flex-col gap-4 min-h-[60vh] ring-1 ring-slate-700">
          <h2 className="text-2xl font-bold text-cyan-400">3. Your Generated SVG</h2>
          <SvgDisplay svgString={generatedSvg} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default App;
