import { useState } from 'react';
import API from '../api';

function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [detecting, setDetecting] = useState(false);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setError('');
    setDone(false);
    setDownloadUrl(null);
    setTotalPages(null);
    setStartPage('');
    setEndPage('');

    setDetecting(true);
    try {
      const formData = new FormData();
      formData.append('pdf', selected);
      const res = await API.post('/pdf/page-count', formData);
      setTotalPages(res.data.totalPages);
    } catch {
      setError('Could not read PDF. Try another file.');
      setFile(null);
    } finally {
      setDetecting(false);
    }
  };

  const handleSplit = async () => {
    const start = parseInt(startPage);
    const end = parseInt(endPage);

    if (!file || !start || !end) {
      setError('Enter valid page range.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('startPage', start);
      formData.append('endPage', end);

      const res = await API.post('/pdf/split', formData, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch {
      setError('Failed to extract pages.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `pages-${startPage}-${endPage}.pdf`;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setStartPage('');
    setEndPage('');
    setError('');
    setDone(false);
    setDownloadUrl(null);
    setTotalPages(null);
  };

  return (
    <div className="w-full">
      <div className="mb-6 pb-6 border-b border-gray-100 font-sans">
        <h2 className="text-lg sm:text-xlg font-bold text-gray-900 tracking-tight">PDF Splitter</h2>
        <p className="text-sm text-gray-400 mt-1 font-medium italic">Segment or extract pages into a new document.</p>
      </div>

      <div className="mb-8">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Upload PDF</label>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100/50">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-xs text-gray-500
              file:mr-4 file:py-2.5 file:px-6 file:rounded-xl
              file:border-0 file:text-xs file:font-bold
              file:bg-emerald-50 file:text-emerald-700
              hover:file:bg-emerald-100 transition-all cursor-pointer"
          />
          {detecting && <p className="text-[10px] text-emerald-600 mt-4 font-bold animate-pulse tracking-widest">ANALYZING DOCUMENT...</p>}
          {totalPages && !detecting && (
            <div className="inline-flex bg-white px-4 py-2 rounded-xl mt-4 border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">CAPACITY:</span>
              <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{totalPages} PAGES TOTAL</span>
            </div>
          )}
        </div>
      </div>

      {file && totalPages && !done && (
        <div className="mb-10 bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100/50 max-w-sm ml-auto mr-auto sm:ml-0 overflow-hidden">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-6">DEFINE RANGE:</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-[9px] font-bold text-gray-400 block mb-2 tracking-widest uppercase">FROM</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                placeholder="1"
                className="w-full bg-white px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm shadow-emerald-700/5"
              />
            </div>
            <div className="text-gray-300 font-bold mt-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-bold text-gray-400 block mb-2 tracking-widest uppercase">TO</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                placeholder={String(totalPages)}
                className="w-full bg-white px-4 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 shadow-sm shadow-emerald-700/5"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-xs px-5 py-4 rounded-xl border border-red-100 mb-8 font-medium">
          {error}
        </div>
      )}
      {done && (
        <div className="bg-emerald-50 border border-emerald-100/50 text-emerald-700 text-xs px-5 py-4 rounded-xl mb-8 font-bold flex items-center justify-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          DOCUMENT EXTRACTED.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        {file && totalPages && !done && (
          <button
            onClick={handleSplit}
            disabled={loading || !startPage || !endPage}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 tracking-tight text-sm transition-all shadow-sm flex items-center justify-center"
          >
            {loading ? 'ANALYZING...' : 'EXTRACT PAGES'}
          </button>
        )}
        {done && (
          <>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black tracking-tight text-sm transition-all shadow-sm shadow-gray-200 uppercase"
            >
              DOWNLOAD DOC
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-200 tracking-tight text-sm transition-all uppercase"
            >
              RESTART
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PdfSplitter;