import { useState } from 'react';
import BackgroundRemover from '../components/BackgroundRemover';
import ImageCompressor from '../components/ImageCompressor';

const tabs = ['Background Remover', 'Image Compressor'];

function ImageTools() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Image Tools</h1>
        <p className="text-sm text-gray-500 mt-1">
          Process and optimize your images
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition ${activeTab === i
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        {activeTab === 0 && <BackgroundRemover />}
        {activeTab === 1 && <ImageCompressor />}
      </div>
    </div>
  );
}

export default ImageTools;