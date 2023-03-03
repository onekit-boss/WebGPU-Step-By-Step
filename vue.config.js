const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.wgsl$/,
      use: [{
        loader: 'raw-loader'
      }]
    })
  }
})