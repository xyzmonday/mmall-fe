/**
 * webpack的配置文件
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
/*var devServer = require('webpack-dev-server');*/
//环境变量，dev／online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

//获取Html模板配置
var getHtmlConfig = function(name, title) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        favicon: './favicon.ico',
        title: title,
        inject: true,
        hash: true,
        chunks: ['common', name]
    }
}


var config = {
    entry: {
        'common': ['./src/page/common/index.js'],
        'index': ['./src/page/index/index.js'],
        'user-login': ['./src/page/user-login/index.js'],
        'user-register': ['./src/page/user-register/index.js'],
        'user-pass-reset': ['./src/page/user-pass-reset/index.js'],
        'result': ['./src/page/result/index.js']
    },
    output: {
        //打包后保存的路径
        path: __dirname + '/dist/',
        //访问文件的根路径
        publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.happymall.shop/mmall-fe/dist/',
        filename: 'js/[name].js',
    },
    externals: {
        //  'jquery': 'window.jQuery',
        jquery: "jQuery"
    },
    resolve: {
        alias: {
            node_modules: __dirname + '/node_modules',
            util: __dirname + '/src/util',
            page: __dirname + '/src/page',
            service: __dirname + '/src/service',
            image: __dirname + '/src/image'
        }
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
            //outputPath表示输出的目录，publicPath表示引用的路径
            loader: 'url-loader?limit=4000&name=image/[name][hash:8].[ext]'
        }, {
            test: /\.string$/,
            loader: 'html-loader',
            query: {
                minimize: true,
                removeAttributeQuotes: false
            }
        }, {
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }],
            exclude: /node_modules/
        }]
    },
    plugins: [
        //处理js公共模块
        new webpack.optimize.CommonsChunkPlugin({
            //entry为common的module将打包
            name: 'common',
            filename: 'js/base.js'
        }),
        //把css单独打包
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        }),
        //webpack-dev-server
        new webpack.HotModuleReplacementPlugin(),
        //html模板
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登陆')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '重置密码')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
    ],
    /* devServer: {
         //配置webpack-dev-server
         historyApiFallback: true,
         inline: true,
         compress: true,
         port: 9000
     }*/
};
if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}
module.exports = config;