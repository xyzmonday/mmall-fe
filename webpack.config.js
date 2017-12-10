/**
 * webpack的配置文件
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
/*var devServer = require('webpack-dev-server');*/
//环境变量，dev／online
//在windows的环境 dev-win/online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log("WEBPACK_ENV = " + WEBPACK_ENV);
console.log("'dev' == WEBPACK_ENV  = " + ('dev' == WEBPACK_ENV .toString()));
console.log('dev' === WEBPACK_ENV );
//获取Html模板配置
var getHtmlConfig = function(name, title) {
    return {
        template      :  './src/view/' + name + '.html',
        filename       :  'view/' + name + '.html',
        favicon         :   './favicon.ico',
        title              :  title,
        inject           :  true,
        hash             :  true,
        chunks         :  ['common', name]
    }
}


var config = {
    entry: {
        'common'                                   :      ['./src/page/common/index.js'],
        'index'                                        :     ['./src/page/index/index.js'],
        'cart'                                          :     ['./src/page/cart/index.js'],
         'list'                                           :     ['./src/page/list/index.js'],
         'detail'                                      :     ['./src/page/detail/index.js'],
        'user-login'                                :     ['./src/page/user-login/index.js'],
        'user-register'                         :     ['./src/page/user-register/index.js'],
        'user-pass-reset'                    :     ['./src/page/user-pass-reset/index.js'],
         'user-pass-update'                 :     ['./src/page/user-pass-update/index.js'],
        'user-center'                            :     ['./src/page/user-center/index.js'],
         'user-center-update'             :     ['./src/page/user-center-update/index.js'],
        'result'                                       :     ['./src/page/result/index.js']
    },
    output: {
        //打包后保存的路径
        path              :  __dirname + '/dist/',
        //访问文件的根路径
       // publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.happymall.shop/mmall-fe/dist/',
        publicPath   :  '/dist/',
        filename       :  'js/[name].js',
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
        new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表页')),
        new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情页')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登陆')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '重置密码')),
       new HtmlWebpackPlugin(getHtmlConfig('user-pass-update', '修改密码')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center', '个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '修改个人信息')),
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