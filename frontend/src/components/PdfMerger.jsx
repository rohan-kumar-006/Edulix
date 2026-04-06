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
      setError('Please add at least 2 PDF files');
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
      setError('Failed to merge PDFs');
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
    <div className="max-w-xl mx-auto">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">PDF Merger</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload multiple PDFs and arrange their order
        </p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">

        <div className="mb-6">
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFilesChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4 file:rounded-lg
              file:border file:border-gray-200 file:text-sm file:font-medium
              file:bg-gray-50 file:text-gray-700
              hover:file:bg-gray-100 transition"
          />
        </div>

        {files.length > 0 && !done && (
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Merge Order
            </p>

            <ul className="space-y-2">
              {files.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                >
                  <span className="text-xs font-semibold text-emerald-600 w-5 text-center">
                    {i + 1}
                  </span>

                  <span className="text-sm text-gray-800 flex-1 truncate">
                    {item.name}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                      className="px-2 py-1 text-xs rounded-md bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-30"
                    >
                      ↑
                    </button>

                    <button
                      onClick={() => moveDown(i)}
                      disabled={i === files.length - 1}
                      className="px-2 py-1 text-xs rounded-md bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-30"
                    >
                      ↓
                    </button>

                    <button
                      onClick={() => removeFile(i)}
                      className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {done && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 px-4 py-2 rounded-lg">
            PDFs merged successfully
          </div>
        )}

        <div className="flex gap-3">
          {!done ? (
            <button
              onClick={handleMerge}
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Merging...' : 'Merge PDFs'}
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
                Reset
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfMerger;