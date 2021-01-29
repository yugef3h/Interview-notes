const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const { resolve } = require('path');

module.exports={
  entry:'./src/index.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'bundle.js'
  },
  devtool:'source-map',
  devServer:{
    contentBase:'./',
    open:true
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'src/index.html')
    })
  ]
}