const path = require('path')
module.exports = {
  devServer:{
    port:8991
  },
  publicPath: '.',
  configureWebpack: {
    resolve: {
        alias: {
          '@enums':path.resolve(__dirname,'src/enums')
        }
    }
  }
}
