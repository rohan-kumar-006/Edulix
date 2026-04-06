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
      setError('Failed to split PDF.');
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
    <div className="max-w-xl mx-auto">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">PDF Splitter</h2>
        <p className="text-sm text-gray-500 mt-1">
          Extract specific pages from your PDF
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

          {detecting && (
            <p className="text-xs text-gray-400 mt-2">Reading PDF...</p>
          )}

          {totalPages && (
            <p className="text-xs text-gray-500 mt-2">
              Total pages: <span className="font-semibold text-gray-900">{totalPages}</span>
            </p>
          )}
        </div>

        {file && totalPages && !done && (
          <div className="flex items-end gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-500">Start</label>
              <input
                type="number"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                className="w-24 mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="text-gray-400 pb-2">→</div>

            <div>
              <label className="text-xs text-gray-500">End</label>
              <input
                type="number"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                className="w-24 mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {done && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 px-4 py-2 rounded-lg">
            Pages extracted successfully
          </div>
        )}

        <div className="flex gap-3">
          {!done ? (
            <button
              onClick={handleSplit}
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Split PDF'}
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

export default PdfSplitter;