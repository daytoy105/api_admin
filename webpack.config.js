var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path')

const nodeEnv = process.env.NODE_ENV || 'development';
const isPro = nodeEnv === 'production';

console.log("当前运行环境：", isPro ? 'production' : 'development')
var plugins = [
    new ExtractTextPlugin("bundle.css"),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity), // 这是第三方库打包生成的文件
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(nodeEnv) })
]
if (isPro) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false, // remove all comments
            },
            compress: {
                warnings: false
            }
        })
    )
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin() 
    )
}

var config = {
    entry: {
        bundle: './index.js',
        vendors: ['react', 'react-dom']
    },

    output: {
        path: './dist',
        publicPath: 'dist/',
        filename: '[name].js',
        chunkFilename: 'chunk.[name].js', // 路由的按需加载需要配置这一项
    },
    module: {
        loaders: [
            {　test: /\.(png|jpg|gif)$/, 　　　　　　
                loader: 'url-loader?limit=512&name=images/[name].[ext]'　　　　 
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader", 'resolve-url')
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    babel: {
        presets: ['es2015', 'stage-2', 'react'],
        plugins: ['transform-decorators-legacy', "transform-class-properties",'transform-runtime', ["import", { libraryName: "antd", style: "css" }],'add-module-exports'] //transform-decorators-legacy :装饰器插件
    },
    plugins:plugins
}

module.exports = config

//webpack-dev-server --history-api-fallback
