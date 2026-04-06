const pdfService = require('../services/pdfService');
const fs = require('fs');

function cleanup(files) {
  const list = Array.isArray(files) ? files : [files];
  list.forEach(f => {
    const p = f?.path || f;
    if (p && fs.existsSync(p)) {
      try { fs.unlinkSync(p); } catch (e) { /* ignore */ }
    }
  });
}

const mergePdfs = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files' });
    }

    let order;
    if (req.body.order) {
      order = JSON.parse(req.body.order);
    } else {
      order = req.files.map((_, i) => i);
    }

    const filePaths = req.files.map(f => f.path);
    const mergedBytes = await pdfService.mergePdfs(filePaths, order);

    const totalOriginal = req.files.reduce((sum, f) => sum + f.size, 0);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=merged.pdf',
      'X-Original-Size': totalOriginal.toString(),
      'X-Compressed-Size': mergedBytes.length.toString()
    });
    res.send(Buffer.from(mergedBytes));
  } catch (err) {
    console.error('Merge error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to merge PDFs' });
  } finally {
    if (req.files) cleanup(req.files);
  }
};

const splitPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    const startPage = parseInt(req.body.startPage);
    const endPage = parseInt(req.body.endPage);

    if (isNaN(startPage) || isNaN(endPage)) {
      return res.status(400).json({ error: 'Please provide start and end page numbers' });
    }

    const result = await pdfService.splitPdf(req.file.path, startPage, endPage);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=split.pdf',
      'X-Original-Size': req.file.size.toString(),
      'X-Total-Pages': result.totalPages.toString()
    });
    res.send(Buffer.from(result.pdfBytes));
  } catch (err) {
    console.error('Split error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to split PDF' });
  } finally {
    cleanup(req.file ? [req.file] : []);
  }
};

const compressPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    const level = req.body.level || 'medium';
    const result = await pdfService.compressPdf(req.file.path, level);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=compressed.pdf',
      'X-Original-Size': result.originalSize.toString(),
      'X-Compressed-Size': result.compressedSize.toString()
    });
    res.send(Buffer.from(result.pdfBytes));
  } catch (err) {
    console.error('Compress PDF error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to compress PDF' });
  } finally {
    cleanup(req.file ? [req.file] : []);
  }
};

const getPageCount = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    const totalPages = await pdfService.getPageCount(req.file.path);
    res.json({ totalPages });
  } catch (err) {
    console.error('Page count error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to get page count' });
  } finally {
    cleanup(req.file ? [req.file] : []);
  }
};

module.exports = { mergePdfs, splitPdf, compressPdf, getPageCount };
