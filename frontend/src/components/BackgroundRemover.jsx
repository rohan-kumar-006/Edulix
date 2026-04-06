import { useState } from 'react';
import API from '../api';

function BackgroundRemover() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
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

  const handleRemove = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await API.post('/image/remove-bg', formData);
      const { file: base64, format } = res.data;

      setResult(`data:image/${format};base64,${base64}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove background');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result;
    a.download = 'no-background.png';
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="w-full">
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold font-sans text-gray-900 tracking-tight">Background Remover</h2>
        <p className="text-sm text-gray-400 mt-1 font-medium">Automatic context-aware transparency.</p>
      </div>

      <div className="mb-10">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Upload Image</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="block w-full text-xs text-gray-500
            file:mr-4 file:py-2.5 file:px-6 file:rounded-xl
            file:border-0 file:text-xs file:font-bold
            file:bg-emerald-50 file:text-emerald-700
            hover:file:bg-emerald-100 transition-all cursor-pointer"
        />
        <p className="text-[10px] text-gray-400 mt-3 font-semibold text-center sm:text-left tracking-wide">JPG, PNG OR WEBP. LIMIT 10MB.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs px-5 py-4 rounded-xl border border-red-100/50 mb-8 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-10">
        {preview && (
          <div className="w-full">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Before</span>
            <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50 flex items-center justify-center overflow-hidden">
              <img src={preview} alt="Before" className="max-h-60 sm:max-h-80 object-contain rounded-lg" />
            </div>
          </div>
        )}
        {result && (
          <div className="w-full">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">After</span>
            <div className="checkerboard border border-gray-100 rounded-2xl p-3 flex items-center justify-center overflow-hidden bg-white">
              <img src={result} alt="After" className="max-h-60 sm:max-h-80 object-contain rounded-lg" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        {file && !result && (
          <button
            onClick={handleRemove}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 tracking-tight text-sm transition-all shadow-sm flex items-center justify-center"
          >
            {loading ? 'PROCESSING...' : 'REMOVE BACKGROUND'}
          </button>
        )}
        {result && (
          <>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black tracking-tight text-sm transition-all shadow-sm"
            >
              DOWNLOAD PNG
            </button>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 tracking-tight text-sm transition-all border border-gray-200/50"
            >
              START OVER
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BackgroundRemover;