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
      const url = URL.createObjectURL(blob);

      setResult({ originalSize, compressedSize, url });
    } catch {
      setError('Failed to compress PDF');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-xl mx-auto">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">PDF Compressor</h2>
        <p className="text-sm text-gray-500 mt-1">
          Reduce PDF size while keeping quality
        </p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">

        <div className="mb-6">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4 file:rounded-lg
              file:border file:border-gray-200 file:text-sm file:font-medium
              file:bg-gray-50 file:text-gray-700
              hover:file:bg-gray-100 transition"
          />

          {file && (
            <p className="text-xs text-gray-500 mt-2">
              File size: <span className="font-medium text-gray-900">{formatSize(file.size)}</span>
            </p>
          )}
        </div>

        {file && !result && (
          <div className="mb-6">
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              Compression Level
            </label>

            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-4 py-2 text-sm rounded-xl border capitalize transition ${level === lvl
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {level === 'low' && 'Minimal compression, best quality'}
              {level === 'medium' && 'Balanced compression and quality'}
              {level === 'high' && 'Maximum compression, reduced quality'}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mb-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-4 text-sm">

              <div>
                <p className="text-xs text-gray-500">Original</p>
                <p className="font-semibold text-gray-900">
                  {formatSize(result.originalSize)}
                </p>
              </div>

              <span className="text-gray-300 text-lg">→</span>

              <div>
                <p className="text-xs text-gray-500">Compressed</p>
                <p className="font-semibold text-green-600">
                  {formatSize(result.compressedSize)}
                </p>
              </div>

              <div className="ml-auto">
                {savedPercent > 0 ? (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {savedPercent}% smaller
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                    Already optimized
                  </span>
                )}
              </div>

            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!result ? (
            <button
              onClick={handleCompress}
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Compressing...' : 'Compress PDF'}
            </button>
          ) : (
            <>
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition"
              >
                Download
              </button>

              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                Try Another
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfCompressor;