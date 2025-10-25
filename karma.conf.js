// karma.conf.js
const webpackConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: { extensions: ['.js', '.jsx'] }
};

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [{ pattern: 'test/**/*.spec.js', watched: false }],
    preprocessors: { 'test/**/*.spec.js': ['webpack', 'sourcemap'] },
    webpack: webpackConfig,
    reporters: ['spec'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};