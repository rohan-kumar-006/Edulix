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
    <div className="max-w-xl mx-auto">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Background Remover</h2>
        <p className="text-sm text-gray-500 mt-1">
          Remove background from any image
        </p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">

        <div className="mb-6">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4 file:rounded-lg
              file:border file:border-gray-200 file:text-sm file:font-medium
              file:bg-gray-50 file:text-gray-700
              hover:file:bg-gray-100 transition"
          />
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {preview && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Original
              </p>
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <img
                  src={preview}
                  alt="Original"
                  className="max-h-64 mx-auto object-contain"
                />
              </div>
            </div>
          )}

          {result && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                Result
              </p>
              <div className="border border-gray-100 rounded-xl p-4 bg-white">
                <img
                  src={result}
                  alt="Result"
                  className="max-h-64 mx-auto object-contain"
                />
              </div>
            </div>
          )}

        </div>

        <div className="flex gap-3">
          {!result ? (
            file && (
              <button
                onClick={handleRemove}
                disabled={loading}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Remove Background'}
              </button>
            )
          ) : (
            <>
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition"
              >
                Download PNG
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

export default BackgroundRemover;