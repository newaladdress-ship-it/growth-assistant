const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#004AC6"/>
      <stop offset="50%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
    <linearGradient id="glyphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E0E7FF"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background Card -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Outer Tech Ring -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="8" stroke-dasharray="16 12"/>
  
  <!-- Inner Dynamic Glow -->
  <circle cx="256" cy="256" r="140" fill="#FFFFFF" fill-opacity="0.06"/>

  <!-- AI Neural Network & Growth Chart Icon -->
  <g filter="url(#shadow)">
    <!-- Growth Trend line -->
    <path d="M 140 330 L 210 260 L 270 300 L 370 170" fill="none" stroke="url(#glyphGrad)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Growth Arrow -->
    <path d="M 320 170 L 370 170 L 370 220" fill="none" stroke="url(#glyphGrad)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Neural Nodes -->
    <circle cx="140" cy="330" r="18" fill="#FFFFFF"/>
    <circle cx="210" cy="260" r="18" fill="#FFFFFF"/>
    <circle cx="270" cy="300" r="18" fill="#FFFFFF"/>
    <circle cx="370" cy="170" r="22" fill="#38BDF8"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');

// Function to generate raw uncompressed PNG with zlib
const zlib = require('zlib');

function createPngBuffer(width, height) {
  // SVG renders into PNG pixel buffer logically
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type None
    
    const ny = y / height; // 0..1
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const pxOffset = rowOffset + 1 + x * 4;

      // Check distance from center for rounded rect (rx=0.22)
      const cx = nx - 0.5;
      const cy = ny - 0.5;
      
      // Radius gradient
      const dist = Math.sqrt(cx * cx + cy * cy);
      
      // Base Brand Gradient (#004AC6 to #6366F1)
      let r = Math.round(0x00 + nx * 0x63);
      let g = Math.round(0x4A + nx * (0x66 - 0x4A));
      let b = Math.round(0xC6 + nx * (0xF1 - 0xC6));

      // Draw simple growth line pixels
      // Line formula: y = -x + 0.9 approximately
      const lineDist = Math.abs((ny + nx) - 0.9);
      const isNode = Math.hypot(nx - 0.72, ny - 0.33) < 0.06 || Math.hypot(nx - 0.28, ny - 0.65) < 0.05;

      if (isNode) {
        r = 0x38; g = 0xBD; b = 0xF8; // Cyan node
      } else if (lineDist < 0.035 && nx > 0.25 && nx < 0.75 && ny > 0.3 && ny < 0.7) {
        r = 0xFF; g = 0xFF; b = 0xFF; // White line
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = 255; // Alpha
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type RGBA
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4);
  data.copy(buf, 8);

  const crc = crc32(Buffer.concat([Buffer.from(type), data]));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate PNG icons
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPngBuffer(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPngBuffer(512, 512));
fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), createPngBuffer(180, 180));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPngBuffer(64, 64));

console.log('PWA icons created successfully in public/');
