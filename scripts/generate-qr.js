// Script to generate QR code for the website
// Run: node scripts/generate-qr.js

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const url = 'https://louisiana-guided-walks.up.railway.app/';
const outputPath = path.join(__dirname, '../public/qr-code.png');

QRCode.toFile(outputPath, url, {
  errorCorrectionLevel: 'H',
  type: 'png',
  width: 500,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) {
    console.error('Error generating QR code:', err);
    process.exit(1);
  }
  console.log('✅ QR code generated successfully!');
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`🔗 URL: ${url}`);
});
