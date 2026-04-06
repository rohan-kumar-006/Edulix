import { useState } from 'react';
import BackgroundRemover from '../components/BackgroundRemover';
import ImageCompressor from '../components/ImageCompressor';

const tabs = ['Background Remover', 'Image Compressor'];

function ImageTools() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Image Tools</h1>
        <p className="text-sm text-gray-500 mt-1">
          Process and optimize your images
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all border ${activeTab === i
              ? 'bg-emerald-600 text-white shadow-sm border-emerald-600'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100/50 shadow-sm rounded-2xl p-4 sm:p-6">
        {activeTab === 0 && <BackgroundRemover />}
        {activeTab === 1 && <ImageCompressor />}
      </div>
    </div>
  );
}

export default ImageTools;