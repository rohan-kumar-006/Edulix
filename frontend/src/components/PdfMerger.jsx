import { useState } from 'react';
import API from '../api';

function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    const items = selected.map((f) => ({ file: f, name: f.name }));
    setFiles(items);
    setError('');
    setDone(false);
    setDownloadUrl(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...files];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFiles(updated);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setFiles(updated);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach((item) => formData.append('pdfs', item.file));

      const res = await API.post('/pdf/merge', formData, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setDone(true);
    } catch {
      setError('Failed to merge PDFs. All files must be valid documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'merged.pdf';
    a.click();
  };

  const handleReset = () => {
    setFiles([]);
    setError('');
    setDone(false);
    setDownloadUrl(null);
  };

  return (
    <div className="w-full">
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold font-sans text-gray-900 tracking-tight">PDF Merger</h2>
        <p className="text-sm text-gray-400 mt-1 font-medium italic">Join documents into a single master file.</p>
      </div>

      <div className="mb-10">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Upload PDF Files</label>
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFilesChange}
          className="block w-full text-xs text-gray-400
            file:mr-4 file:py-2.5 file:px-6 file:rounded-xl
            file:border-0 file:text-xs file:font-bold
            file:bg-emerald-50 file:text-emerald-700
            hover:file:bg-emerald-100 transition-all cursor-pointer"
        />
        <p className="text-[10px] text-gray-400 mt-3 font-semibold text-center sm:text-left tracking-wide uppercase">Select 2+ PDF files. LIMIT 50MB.</p>
      </div>

      {files.length > 0 && !done && (
        <div className="mb-10 p-4 sm:p-6 bg-gray-50 border border-gray-100 rounded-2xl">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-6">MERGE SEQUENCE:</label>
          <div className="space-y-3">
            {files.map((item, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-xl p-4 sm:px-6 border border-gray-100 shadow-sm"
              >
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 font-mono w-6 text-center">0{i + 1}</span>
                <span className="flex-1 text-sm font-bold text-gray-900 truncate w-full sm:w-auto text-center sm:text-left">{item.name}</span>
                <div className="flex gap-2 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="flex-1 sm:flex-none p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 disabled:opacity-20 transition-all hover:bg-emerald-100"
                  >
                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === files.length - 1}
                    className="flex-1 sm:flex-none p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 disabled:opacity-20 transition-all hover:bg-emerald-100"
                  >
                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button
                    onClick={() => removeFile(i)}
                    className="flex-1 sm:flex-none p-2 bg-red-50 border border-red-100 rounded-lg text-red-600 hover:bg-red-100 transition-all"
                  >
                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-xs px-5 py-4 rounded-xl border border-red-100/50 mb-8 font-medium">
          {error}
        </div>
      )}
      {done && (
        <div className="bg-emerald-50 text-emerald-700 text-xs px-5 py-4 rounded-xl border border-emerald-100/50 mb-8 font-bold flex items-center justify-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          DOCUMENTS MERGED SUCCESSFULLY.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        {files.length >= 2 && !done && (
          <button
            onClick={handleMerge}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 tracking-tight text-sm transition-all shadow-sm flex items-center justify-center"
          >
            {loading ? 'MERGING...' : 'PROCEED TO MERGE'}
          </button>
        )}
        {done && (
          <>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black tracking-tight text-sm transition-all shadow-sm shadow-gray-200"
            >
              DOWNLOAD EXPORT
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-200 tracking-tight text-sm transition-all"
            >
              START NEW SESSION
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PdfMerger;