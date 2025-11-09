
import React from 'react';
import { DownloadIcon, ImageIcon } from './icons';

interface SvgDisplayProps {
  svgString: string | null;
  isLoading: boolean;
}

export const SvgDisplay: React.FC<SvgDisplayProps> = ({ svgString, isLoading }) => {

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-concept.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-slate-400">
            <div className="animate-pulse">
                <ImageIcon className="w-24 h-24 text-slate-600" />
            </div>
            <p className="mt-4 text-lg">Generating your masterpiece...</p>
            <p className="text-sm text-slate-500">The AI is thinking. This may take a moment.</p>
        </div>
      );
    }
    
    if (svgString) {
      return (
        <>
            <div className="flex-grow w-full bg-white p-4 rounded-lg shadow-inner overflow-auto" dangerouslySetInnerHTML={{ __html: svgString }} />
            <button
                onClick={downloadSvg}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
                <DownloadIcon />
                Download SVG
            </button>
        </>
      );
    }
    
    return (
        <div className="flex flex-col items-center justify-center text-center text-slate-500">
            <ImageIcon className="w-24 h-24 text-slate-600" />
            <p className="mt-4 text-lg">Your generated SVG will appear here</p>
            <p className="text-sm">Fill out the form and click "Generate SVG" to begin.</p>
        </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full bg-slate-900/80 rounded-lg p-4 gap-4 border border-slate-700">
      {renderContent()}
    </div>
  );
};
