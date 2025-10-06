/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { UploadIcon } from './icons';

interface CombinePanelProps {
  onCombine: (sourceImage: File, prompt: string) => void;
  isLoading: boolean;
}

const CombinePanel: React.FC<CombinePanelProps> = ({ onCombine, isLoading }) => {
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const sourceImageUrl = useMemo(() => {
    if (sourceImageFile) {
      return URL.createObjectURL(sourceImageFile);
    }
    return null;
  }, [sourceImageFile]);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      setSourceImageFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };
  
  const handleApply = () => {
    if (sourceImageFile && prompt) {
      onCombine(sourceImageFile, prompt);
    }
  };

  const uploaderContent = sourceImageUrl ? (
    <div className="relative group">
        <img src={sourceImageUrl} alt="Fonte" className="w-full h-48 object-contain rounded-md bg-black/20" />
        <button onClick={() => setSourceImageFile(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remover imagem de origem">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
    </div>
  ) : (
    <label
        htmlFor="source-image-upload"
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDraggingOver ? 'border-blue-400 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-white/5'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            handleFileSelect(e.dataTransfer.files);
        }}
    >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-8 h-8 mb-4 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Clique para carregar</span> ou arraste e solte</p>
            <p className="text-xs text-gray-500">A foto com o item que você deseja usar</p>
        </div>
        <input id="source-image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </label>
  );


  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300">Combinar Imagens</h3>
      <p className="text-sm text-gray-400 -mt-3 text-center">Use uma segunda foto para adicionar ou trocar roupas e objetos.</p>
      
      {uploaderContent}

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: 'coloque a jaqueta da foto acima na pessoa'"
        className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
        disabled={isLoading || !sourceImageFile}
      />
      
      <button
          onClick={handleApply}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !sourceImageFile || !prompt.trim()}
      >
          Combinar Imagens
      </button>
    </div>
  );
};

export default CombinePanel;
