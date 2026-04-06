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
    <div>
      <h3 className="text-base font-semibold text-dark mb-1">Image Compressor</h3>
      <p className="text-sm text-muted mb-5">Compress images to reduce file size</p>

      <div className="mb-5">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          id="image-compressor-input"
          className="block w-full text-sm text-muted
            file:mr-4 file:py-2 file:px-4 file:rounded-lg
            file:border file:border-border file:text-sm file:font-medium
            file:bg-gray-50 file:text-dark
            hover:file:bg-gray-100 file:cursor-pointer file:transition-colors"
        />
      </div>

      {file && !result && (
        <div className="mb-5">
          <label className="block text-xs font-medium text-muted mb-2">
            Quality: <span className="text-dark font-semibold">{quality}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full max-w-sm"
          />
          <div className="flex gap-2 mt-2">
            {[
              { label: 'Low', value: 30 },
              { label: 'Medium', value: 60 },
              { label: 'High', value: 80 },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setQuality(preset.value)}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${quality === preset.value
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'bg-gray-50 border-border text-muted hover:bg-gray-100'
                  }`}
              >
                {preset.label} ({preset.value}%)
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-50 border border-border rounded-lg p-4 mb-5">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-muted text-xs block">Original</span>
              <span className="font-semibold text-dark">{formatSize(result.originalSize)}</span>
            </div>
            <div>
              <span className="text-muted text-xs block">Compressed</span>
              <span className="font-semibold text-green-600">{formatSize(result.compressedSize)}</span>
            </div>
            <div className="ml-auto">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                {savedPercent}% smaller
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {preview && (
          <div>
            <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wide">
              Original <span className="normal-case text-muted">({formatSize(file.size)})</span>
            </p>
            <div className="border border-border rounded-lg p-3 bg-gray-50">
              <img
                src={preview}
                alt="Original"
                className="max-w-full max-h-56 rounded object-contain mx-auto"
              />
            </div>
          </div>
        )}
        {result && (
          <div>
            <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wide">
              Compressed <span className="normal-case text-muted">({formatSize(result.compressedSize)})</span>
            </p>
            <div className="border border-border rounded-lg p-3 bg-gray-50">
              <img
                src={result.dataUrl}
                alt="Compressed"
                className="max-w-full max-h-56 rounded object-contain mx-auto"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {file && !result && (
          <button
            onClick={handleCompress}
            disabled={loading}
            className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover disabled:opacity-50 text-sm transition-colors"
          >
            {loading ? 'Compressing...' : 'Compress Image'}
          </button>
        )}
        {result && (
          <>
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 bg-dark text-white rounded-lg font-medium hover:bg-dark/90 text-sm transition-colors"
            >
              Download
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-gray-100 text-dark rounded-lg font-medium hover:bg-gray-200 text-sm transition-colors border border-border"
            >
              Try Another
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageCompressor;
