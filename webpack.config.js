// webpack是node写出来的使用node语言
// 路径
let path = require('path');

// 引入html插件
let htmlWebpackPlugin = require('html-webpack-plugin');

// 引入css插件
let miniCssExtractPlugin = require('mini-css-extract-plugin');

// 引入css压缩插件
let OptimizeCss = require('optimize-css-assets-webpack-plugin');

// 引入js压缩插件
let UglifyjsPlugin = require('uglifyjs-webpack-plugin');

// 引入postcss，自动给css3样式＋前缀, 处理css兼容性
let postCss = require('autoprefixer')({
    "overrideBrowserslist": [
        'last 10 Chrome versions',
        'last 5 Firefox versions',
        'Safari>=6',
        'ie>8'
    ]
});

module.exports = {
    // 模式 默认两种 production (生产环境:代码压缩) development(开发环境:代码不压缩)
    mode: "development", // 配置了css和js压缩的情况下，mode将不在生效
    // 多入口
    entry: {
        index: './src/index.js',
        admin: './src/admin.js'
    },
    output: {
        filename: "static/js/[name].js", // 打包后的文件名
        path: path.resolve('dist'), // 路径必须是一个绝对路径
        publicPath: "/" // dist之后的公共路径
    },
    devServer: {
        // 开启服务器配置
        port: 8080, // 端口
        host: "localhost", // ip地址：localhost本地，0.0.0.0可以访问网络地址
        progress: true,
        contentBase: "./dist", // 默认打开目录
        open: true, // 自动打开浏览器
        compress: true, // 启动gzp压缩
        // 跨域
        proxy: {
            './api': {
                target: 'http://vueshop.glbuys.com/api/',
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/api': '' // 需要rewrite的
                }
            }
        }
    },
    // 插件
    plugins: [
        new htmlWebpackPlugin({
            template: './public/index.html', // 关联的模板路径index.html
            filename: 'index.html', // 入口文件名
            chunks: ['index'], // 只引用index.js，解决index.html里面有index.js和admin.js的问题
            minify: {
                // 折叠不换行
                collapseWhitespace: true
            },
            hash: true
        }),

        new htmlWebpackPlugin({
            template: "./public/admin.html", // 关联的模板路径admin.html
            filename: "admin.html", // 入口文件名
            chunks: ['admin'], // 只引用admin.js，解决admin.html里面有index.js和admin.js的问题
            minify: {
                collapseWhitespace: true // 折叠不换行
            },
            hash: true
        }),

        new miniCssExtractPlugin({
            filename: 'static/css/main.css'
        })
    ],
    // 规则
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                miniCssExtractPlugin.loader, // 都放到了上面的css.mian里面
                {
                    loader: 'css-loader'
                },
                {   // 处理css兼容性
                    loader: "postcss-loader",
                    options: {
                        plugins: [
                            postCss
                        ]
                    }
                }
            ]
        }]
    },
    // css压缩
    optimization: {
        // 优化项目启动后mode模式代码压缩不再生效，必须配置js压缩插件
        minimizer: [
            // 优化css
            new OptimizeCss(),

            // 优化js
            new UglifyjsPlugin({
                cache: true, // 是否用缓存
                parallel: true, // 是否并发打包
                sourceMap: true // es6 映射为es5需要用
            })
        ]
    }
};