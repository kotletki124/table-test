const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: {
    main: path.join(__dirname, 'src', 'server', 'index.js'),
    initDb: path.join(__dirname, 'src', 'server', 'generateDummyData.js'),
  },
  output: {
    filename: chunkData =>
      chunkData.chunk.name === 'main' ? 'main.js' : '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
};
