import { useState } from 'react';
import API from '../api';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setResult(null);
      setError('');
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('level', level);

      const res = await API.post('/pdf/compress', formData, {
        responseType: 'blob'
      });

      const originalSize = parseInt(res.headers['x-original-size']) || file.size;
      const compressedSize = parseInt(res.headers['x-compressed-size']) || res.data.size;

      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      setResult({ originalSize, compressedSize, url: URL.createObjectURL(blob) });
    } catch {
      setError('PDF compression failed. File may be too large or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'compressed.pdf';
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setLevel('medium');
    setResult(null);
    setError('');
  };

  const savedPercent = result
    ? Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100))
    : 0;

  return (
    <div className="w-full">
      <div className="mb-6 pb-6 border-b border-gray-100 font-sans">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">PDF Compressor</h2>
        <p className="text-sm text-gray-400 mt-1 font-medium italic">Size-effective optimization for documents.</p>
      </div>

      <div className="mb-8">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 ml-2">Select Document</label>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100/50">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-xs text-gray-400
              file:mr-4 file:py-2.5 file:px-6 file:rounded-xl
              file:border-0 file:text-xs file:font-bold
              file:bg-emerald-50 file:text-emerald-700
              hover:file:bg-emerald-100 transition-all cursor-pointer"
          />
          {file && (
            <div className="bg-white px-4 py-2.5 rounded-xl mt-4 border border-gray-100 shadow-sm inline-block shadow-emerald-700/5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">CURRENT: </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{formatSize(file.size)}</span>
            </div>
          )}
        </div>
      </div>

      {file && !result && (
        <div className="mb-10 px-6 pt-8 pb-4 bg-emerald-50/20 border border-emerald-100/50 rounded-3xl max-w-lg mx-auto sm:mx-0">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-6 border-l-4 border-l-emerald-500 pl-4">Optimization Intensity:</label>
          <div className="grid grid-cols-3 gap-2 overflow-hidden pb-4">
            {['low', 'medium', 'high'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`text-[10px] font-bold py-3.5 rounded-xl border transition-all ${
                  level === lvl
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100/40'
                    : 'bg-white text-gray-400 border-gray-100 hover:text-gray-900 shadow-sm'
                }`}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100/50 mt-4 mb-4 shadow-sm shadow-emerald-700/5">
            <p className="text-[11px] text-gray-400 leading-relaxed font-semibold block text-center sm:text-left italic">
              {level === 'low' && 'PRES_QUAL: Balanced compression with high clarity.'}
              {level === 'medium' && 'OPT_STRC: Efficient striping of metadata and structure.'}
              {level === 'high' && 'MAX_SAVE: Aggressive optimization for maximum savings.'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-xs px-5 py-4 rounded-xl border border-red-100 mb-8 font-medium">
          {error}
        </div>
      )}
      {result && (
        <div className="bg-emerald-50 border border-emerald-100/50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest mb-1">ORIGINAL</span>
              <span className="font-bold text-gray-900 text-xs">{formatSize(result.originalSize)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest mb-1">OPT_SIZE</span>
              <span className="font-bold text-emerald-700 text-xs">{formatSize(result.compressedSize)}</span>
            </div>
          </div>
          <div className="bg-white px-6 py-2.5 rounded-xl text-[11px] font-bold text-emerald-700 uppercase tracking-widest shadow-sm border border-emerald-100 shadow-emerald-700/5">
            EXPORT SAVED: {savedPercent}%
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 font-bold uppercase tracking-tight">
        {file && !result && (
          <button
            onClick={handleCompress}
            disabled={loading}
            className="w-full sm:w-auto px-10 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 tracking-tight text-sm transition-all shadow-sm flex items-center justify-center gap-3"
          >
           {loading ? (
             <>
               <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> 
               OPTIMIZING...
             </>
           ) : 'COMMENCE COMPRESSION'}
          </button>
        )}
        {result && (
          <>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-10 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-black tracking-tight text-sm transition-all shadow-sm shadow-gray-200"
            >
              DOWNLOAD COMPRESSED
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-10 py-3.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-200 tracking-tight text-sm transition-all"
            >
              NEW OPTIMIZATION
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PdfCompressor;