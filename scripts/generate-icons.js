const fs = require('fs');
const path = require('path');

// Função para criar um PNG básico preto
function createBlackPNG(width, height, filename) {
  // Cabeçalho PNG básico (1x1 pixel preto)
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, // bit depth
    0x02, // color type (RGB)
    0x00, // compression
    0x00, // filter
    0x00, // interlace
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data (black pixel)
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);

  const filepath = path.join(__dirname, '..', 'assets', 'images', filename);
  fs.writeFileSync(filepath, pngHeader);
  console.log(`Created: ${filename}`);
}

// Criar diretório se não existir
const imagesDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Gerar ícones
createBlackPNG(1024, 1024, 'icon.png');
createBlackPNG(1024, 1024, 'splash.png');
createBlackPNG(1024, 1024, 'adaptive-icon.png');
createBlackPNG(32, 32, 'favicon.png');

console.log('All icons generated successfully!'); 