const path = require('path')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const version = require('./package.json').version + '.' + '220425'
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/PRACTICE_PURPOSE' : './',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  outputDir: path.join(__dirname, '../src/main/webapp/PRACTICE_PURPOSE'),
  assetsDir: 'assets',
  lintOnSave: true,
  runtimeCompiler: true,
  css: {
    sourceMap: false
  },
  filenameHashing: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'FOR PRACTICE'
    },
    // 編輯服務頁面 (單獨頁面)
    editService: {
      entry: 'src/EditService.js',
      template: 'public/index.html',
      filename: 'editService.html',
      title: 'FOR PRACTICE'
    },
    // 編輯服務頁面 (單獨頁面)
    mediaQuery: {
      entry: 'src/MediaQuery.js',
      template: 'public/index.html',
      filename: 'mediaQuery.html',
      title: 'FOR PRACTICE'
    }
  },
  // No need for splitting
  configureWebpack: {
    // Analyze
    optimization: {
      // minimizer: [new UglifyJsPlugin()],
      splitChunks: false
    }
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.output.filename(`assets/js/[name].js?version=${version}`).end()
      config.output
        .chunkFilename(`assets/js/[name].js?version=${version}`)
        .end()
      config.plugin('extract-css').tap(() => [
        {
          filename: `assets/css/[name].css?version=${version}`,
          chunkFilename: `assets/css/[name].css?version=${version}`
        }
      ])
    }
  }
}
