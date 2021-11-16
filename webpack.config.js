const path = require('path');

module.exports = {
  entry: './src/lib/index.js',
  mode: 'production',
  output: {
    filename: `tablescript.bundle.js`,
    path: path.resolve(__dirname, 'dist'),
  },
};
