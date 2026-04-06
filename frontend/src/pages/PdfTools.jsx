import { useState } from 'react';
import PdfMerger from '../components/PdfMerger';
import PdfSplitter from '../components/PdfSplitter';
import PdfCompressor from '../components/PdfCompressor';

const tabs = ['PDF Merger', 'PDF Splitter', 'PDF Compressor'];

function PdfTools() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="mb-8 font-sans">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">PDF Tools</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Merge, split, and compress your PDF files
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

      <div className="bg-white border border-gray-100/50 shadow-sm rounded-2xl p-4 sm:p-6 lg:p-8">
        {activeTab === 0 && <PdfMerger />}
        {activeTab === 1 && <PdfSplitter />}
        {activeTab === 2 && <PdfCompressor />}
      </div>
    </div>
  );
}

export default PdfTools;