const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createCanvas } = require('canvas');

async function mergePdfs(filePaths, order) {
  const mergedPdf = await PDFDocument.create();

  for (const idx of order) {
    const pdfBytes = fs.readFileSync(filePaths[idx]);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}
async function splitPdf(filePath, startPage, endPage) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);

  const totalPages = pdf.getPageCount();
  if (startPage < 1 || endPage > totalPages || startPage > endPage) {
    throw new Error(`Invalid range. This PDF has ${totalPages} pages.`);
  }

  const newPdf = await PDFDocument.create();

  const indices = [];
  for (let i = startPage - 1; i < endPage; i++) {
    indices.push(i);
  }

  const pages = await newPdf.copyPages(pdf, indices);
  pages.forEach(page => newPdf.addPage(page));

  const result = await newPdf.save();
  return { pdfBytes: result, totalPages };
}

async function getPageCount(filePath) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  return pdf.getPageCount();
}

async function compressPdf(filePath, level) {
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

  const originalBytes = fs.readFileSync(filePath);
  const originalSize = originalBytes.length;

  const qualityMap = { low: 40, medium: 62, high: 82 };
  const dpiMap = { low: 96, medium: 120, high: 150 };
  const quality = qualityMap[level] ?? 62;
  const dpi = dpiMap[level] ?? 120;
  const scale = dpi / 72;
  const STANDARD_FONT_DATA_URL = path.join(
    path.dirname(require.resolve('pdfjs-dist/legacy/build/pdf.js')),
    '../../standard_fonts/'
  ).replace(/\\/g, '/');

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(originalBytes),
    standardFontDataUrl: `file:///${STANDARD_FONT_DATA_URL}`,
  });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const newPdf = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const pngBuffer = canvas.toBuffer('image/png');
    const jpegBuffer = await sharp(pngBuffer)
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    const jpgImage = await newPdf.embedJpg(jpegBuffer);
    const pdfPage = newPdf.addPage([viewport.width, viewport.height]);
    pdfPage.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  }

  const compressedBytes = await newPdf.save({ useObjectStreams: true });

  return {
    pdfBytes: compressedBytes,
    originalSize,
    compressedSize: compressedBytes.length,
  };
}

module.exports = { mergePdfs, splitPdf, compressPdf, getPageCount };
