const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function removeBackground(filePath) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('Remove.bg API key is not configured. Add it to your .env file.');
  }

  const formData = new FormData();
  formData.append('image_file', fs.createReadStream(filePath));
  formData.append('size', 'auto');

  const response = await axios({
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data: formData,
    headers: {
      ...formData.getHeaders(),
      'X-Api-Key': apiKey
    },
    responseType: 'arraybuffer'
  });

  const outputPath = filePath.replace(path.extname(filePath), '-nobg.png');
  fs.writeFileSync(outputPath, response.data);

  return {
    outputPath,
    originalSize: fs.statSync(filePath).size,
    processedSize: response.data.length,
    base64: Buffer.from(response.data).toString('base64')
  };
}

async function compressImage(filePath, quality) {
  const originalSize = fs.statSync(filePath).size;
  const ext = path.extname(filePath).toLowerCase();
  const outputPath = filePath.replace(ext, '-compressed' + ext);

  let pipeline = sharp(filePath);

  if (ext === '.png') {
    pipeline = pipeline.png({ quality, effort: 10 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality });
  } else {
    pipeline = pipeline.jpeg({ quality });
  }

  await pipeline.toFile(outputPath);

  const compressedSize = fs.statSync(outputPath).size;
  const base64 = fs.readFileSync(outputPath).toString('base64');

  const mimeMap = { '.png': 'png', '.webp': 'webp', '.jpg': 'jpeg', '.jpeg': 'jpeg' };
  const format = mimeMap[ext] || 'jpeg';

  return { outputPath, originalSize, compressedSize, base64, format };
}

module.exports = { removeBackground, compressImage };
