import { useState } from 'react';
import API from '../api';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState(60);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
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
      formData.append('image', file);
      formData.append('quality', quality);

      const res = await API.post('/image/compress', formData);
      const { originalSize, compressedSize, file: base64, format } = res.data;

      setResult({
        originalSize,
        compressedSize,
        dataUrl: `data:image/${format};base64,${base64}`,
        format
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to compress image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = `compressed.${result.format === 'jpeg' ? 'jpg' : result.format}`;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    setQuality(60);
  };

  const savedPercent = result
    ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
    : 0;

  return (
    <div className="w-full">
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold font-sans text-gray-900 tracking-tight">Image Compressor</h2>
        <p className="text-sm text-gray-400 mt-1 font-medium">Lossy optimization for JPEG, PNG and WEBP.</p>
      </div>

      <div className="mb-8 p-6 bg-gray-50 border border-gray-100/50 rounded-2xl">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Target Image</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="block w-full text-xs text-gray-400
            file:mr-4 file:py-2.5 file:px-6 file:rounded-xl
            file:border-0 file:text-xs file:font-bold
            file:bg-emerald-50 file:text-emerald-700
            hover:file:bg-emerald-100 transition-all cursor-pointer"
        />
        <p className="text-[10px] text-gray-400 mt-3 font-semibold text-center sm:text-left tracking-wide">JPG, PNG OR WEBP. LIMIT 10MB.</p>

        {file && !result && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between">
                  Quality Optimization
                  <span className="text-emerald-700 font-bold bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">{quality}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                {[
                  { label: 'LOW', value: 30 },
                  { label: 'MED', value: 60 },
                  { label: 'MAX', value: 80 },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setQuality(preset.value)}
                    className={`text-[10px] font-bold px-4 py-2.5 rounded-xl border transition-all ${
                      quality === preset.value
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-400 border-gray-100 hover:text-gray-900 shadow-sm'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs px-5 py-4 rounded-xl border border-red-100 mb-8 font-medium italic">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-emerald-50 border border-emerald-100/50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-10">
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest mb-1">ORIGINAL SIZE</span>
              <span className="font-bold text-gray-900 text-xs">{formatSize(result.originalSize)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest mb-1">COMPRESSED SIZE</span>
              <span className="font-bold text-emerald-700 text-xs">{formatSize(result.compressedSize)}</span>
            </div>
          </div>
          <div className="bg-white px-6 py-2.5 rounded-xl text-[11px] font-bold text-emerald-700 uppercase tracking-widest shadow-sm border border-emerald-100 lg:mr-4">
            SAVED: {savedPercent}%
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 overflow-hidden">
        {preview && (
          <div className="w-full">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Before ({formatSize(file.size)})</span>
            <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50 flex items-center justify-center overflow-hidden">
              <img src={preview} alt="Before" className="max-h-60 sm:max-h-80 object-contain rounded-lg" />
            </div>
          </div>
        )}
        {result && (
          <div className="w-full">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">After ({formatSize(result.compressedSize)})</span>
            <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50 flex items-center justify-center overflow-hidden">
              <img src={result.dataUrl} alt="After" className="max-h-60 sm:max-h-80 object-contain rounded-lg" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        {file && !result && (
          <button
            onClick={handleCompress}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 tracking-tight text-sm transition-all shadow-sm flex items-center justify-center"
          >
            {loading ? 'COMPRESSING...' : 'COMPRESS IMAGE'}
          </button>
        )}
        {result && (
          <>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black tracking-tight text-sm transition-all shadow-sm shadow-gray-200"
            >
              DOWNLOAD COMPRESSED
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-200 tracking-tight text-sm transition-all"
            >
              START OVER
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageCompressor;
