import { useState } from 'react';
import PdfMerger from '../components/PdfMerger';
import PdfSplitter from '../components/PdfSplitter';
import PdfCompressor from '../components/PdfCompressor';

const tabs = ['PDF Merger', 'PDF Splitter', 'PDF Compressor'];

function PdfTools() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">PDF Tools</h1>
        <p className="text-sm text-gray-500 mt-1">
          Merge, split, and compress your PDF files
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${activeTab === i
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">

        {activeTab === 0 && <PdfMerger />}
        {activeTab === 1 && <PdfSplitter />}
        {activeTab === 2 && <PdfCompressor />}

      </div>
    </div>
  );
}

export default PdfTools;