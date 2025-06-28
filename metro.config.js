const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Adicionar resolver para aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/screens': path.resolve(__dirname, 'src/screens'),
  '@/services': path.resolve(__dirname, 'src/services'),
  '@/types': path.resolve(__dirname, 'src/types'),
  '@/utils': path.resolve(__dirname, 'src/utils'),
  '@/config': path.resolve(__dirname, 'src/config'),
};

module.exports = config; 