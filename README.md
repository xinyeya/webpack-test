## 1. Webpack配置入口文件和打包后的文件

### 1. Webpack基础介绍
`webpack`是一个模块打包器。`webpack`的主要目标是`JavaScript`文件打包在一起，打包的文件用于在浏览器中使用，但它也能够胜任(transform)、打包(bundle)或包裹(package)任何资源(resource or asset)。
[webpack中文官网](http://www.webpackjs.com/)

### 2. webpack 基础介绍
可以做的事情：
	1. 代码转换
	2. 文件优化
	3. 代码分割
	4. 模块合并
	5. 自动刷新
	6. 代码校验
	7. 自动发布

### 3. webpack配置方法
1. 进入项目项目目录生成`package.json`文件
    ```shell
    npm init
    ```
2. 安装`webpack`和`webpack-cli`(脚手架)
    ```shell
    npm install -save -dev webpack webpack-cli
    ```
3. 执行命令
	```shell
	npx webpack
	```
4. 配置`webpack.json`文件
	```json
	"script": {
		"build": "webpack --config webpack.config.js"
	}
	```
执行：`npm run build`

### 4. webpack配置入口文件和打包后的文件
根目录建立`webpack.config.js`文件

```js
// webpack是node写出来的使用node语言
let path = require('path');
// console.log(path.resolve('dist'));
module.exports = {
    entry: './src/index.js', // 入口
    output: {
        filename: "bundle.js", // 打包后的文件名
        path: path.resolve('dist') // 路径必须是一个绝对路径
    }
}
```

### 5. 打包出的文件解析
```js
let path = require('path');
module.exports = {
    // 模式 默认两种production(生产环境:代码压缩)development(开发环境:代码不压缩)
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve('dist')
    }
}
```

### 6. 执行webpack
执行命令
```shell
npx webpack
```
配置`package.json`文件
```json
"script": {
    "build": "webpack --config webpack.config.js"
}
```
执行：`npm run build`

## 2. webpack-dev-server的安装与配置`proxy`解决跨域问题

### 1. webpack-dev-server的安装与配置
1. 安装`webpack-dev-server`
	```shell
	npm install --save-dev webpack-dev-server
	```
2. 执行:
	```shell
	npx webpack-dev-server
	```
3. 用`webpack.json`配置
	```json
	"script": {
		"dev": "webpack-dev-server"
	}
	```
执行：`npm run dev`

4. webpack-dev-server的配置
```js
	devServer: {
		// 开启服务器配置
		port: 8080, // 端口
		host: "localhost", // ip地址：localhost本地，0.0.0.0可以访问网络地址
		progress: true, // 开启进度条
		contenBase: "./build", // 默认打开目录
		// open: true, // 自动打开浏览器
		compress: true // 启动gzp压缩
	}
```

### 3. 配置代理解决问题
```js
	devServer:{
		// 跨域
		proxy: {
			'./api': {
				target: 'http://10.0.193.147:8080',
				changeOrigin: true, // 是否跨域
				pathRewrite: {
					'^/api': '' // 需要rewrite的
				}
			}
		}
	}
```

## 3. html模板插件

### 1. HTML模板插件
使用html模板插件解决启动`webpack-dev-server`时必须生成`build`文件夹。
1. 安装`html-webpack-plugin`
	```shell
	npm install --save-dev html-webpack-plugin
	```
2. 配置模板插件
	```js
	let HtmlWebpackPlugin = require('html-webpack-plugin');
	// 一个数组存放所有插件
	plugins: [
		// 配置这个模板后 contentBase: "./dist" 不生效
		new HtmlWebpackPlugin(
			{
				// 生成两个看不到的文件	
				template: "./public/index.html", // 关联咱们的模板html
				filename: "index.html", // 入口文件
				minify: {
                    // 折叠换行 true不换行
                    collapseWhitespace: true
                },
                hash: true // 生产环境下生成hash戳
			}
		)
	]
	```
	
## 4. 多页面(MPA)配置

### 1. 多页面配置

1. 多入口
    ```js
    entry: {
        index: "./src/index.js",
        admin: "./src/admin.js"
    }
    ```
2. 输出配置
	```js
		output: {
			filename: "/static/js/[name].js", // 如果是多页面应用不能写死需要用到[name]自动获取入口的 home 和 admin
			path: path.resolve('dist'), // 路径必须是一个路径
			publicPath: "/" // dist之后的公共路径
		}
	```
3. 配置html模板插件
	```js
	plugins: [
		// 配置这个模板后contentBase: "./dist"不生效
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html',
			chunks: ['index'], // 只引用index.js，解决index.html里面有index.js和admin.js的问题。
			// 生产环境下压缩index.html模板
		}),
		
		new HtmlWebpackPlugin({
			template: './public/admin.html',
			filname: 'admin.html',
			chunks: ['admin'],		
		})
	]
	```

### 2. 模拟服务器环境
1. 安装一个全局的 `serve`
	```shell
	npm install -g serve
	# cd 到dist文件夹下直接执行
	cd dist
	serve
	```
2. 例如要把代码文件存放在`dist/demo`文件夹中，解决方法
	```js
	output: {
       filename: "static/js/[name].js", // 打包后的文件名
           path: path.resolve('dist'), // 路径必须是一个绝对路径
               publicPath: "/demo/" // dist之后的公共路径
   }
	```

## 5. css-loader配置加载css样式

### 1. loader安装css样式
1. 安装css loader
	```shell
	npm install --save-dev css-loader style-loader mini-css-extract-plagin
	# css-laoder: 解析@import这种语法
	# style-loader: 把css插入到head标签中
	# mini-css-extract-plugin: 抽离css样式让index.html里面的css样式变成link引入
	```
2. 配置css loader
	- loeader 是有顺序的默认从右向左执行，从下往上执行。
	- loader 可以写成字符串：use: 'css-loader'，写成数组['css-loader']，写成对象 
	- [{loader: 'css-loader'}]对象的好处可以传好多参数。

### 2. loader 配置加载 css 样式

```js
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
plugins: [
    new MiniCssExtractPlugin([
        filename: 'static/css/main.css'
    ])
] 

// 模块
module: {
    // 规则
    rules: [{
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader, // 都放到了上面的main.css里面
            {
                loader: 'css-loader'
            }
        ]
    }]
}
```

## 6. post-css 处理 css 兼容

### 1. css3 自动加前缀`-webkit-`
1. 安装
	```shell
	yarn add -D postcss-loader autoprefixer
	# 或
	npm install --save postcss-loader autoprefixer
	```
	
2. 配置
	```js
	let postCss = require('autoprefixer')({
		"overrideBrowserslist": [
			'last 10 Chrome versions',
			'last 5 Firefox versions',
			'Safari>=6',
			'ie>8'
		]
	});
	
	{
		test: /\.css$/,
		use: [
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
					plugins: [
						postCss
					]
				}
			}
		]
	}
	```

## 7. css和js压缩

### 1. css压缩

```shell
npm install --save optimize-css-assets-webpack-plugin
```

```js
// css压缩
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
module.exports = {
    optimization: { // 优化项目启动后启动mode模式代码压缩不在生效，必须配置js压缩插件
        minizer: [
            new OptimizeCss() // 优化css
        ]
    }
}
```

### 2. js压缩

```shell
npm install --save uglifyjs-webpack-plugin
```

```js
// js压缩
let Uglifyjs = require('uglifyjs-webpack-plugin');

module.exports = {
    optimization: { // 优化项
        minizizer: [
            // 压缩js
            new UglifyjsPlugin({
                cache: true, // 是否用缓存
                paralle: true, // 是否并发打包
                sourceMap: true // es6 映射es5 需要用
            })
        ]
    }
}
```

## 8. 压缩图片

### 1. 安装`url-loader`

```shell
npm install --save-dev url-loader
```

### 2. 配置

```js
module: {
    rules: [
        {
            test: /\.(png|jeg|jpeg)$/,
            use: {
                loader: "url-loader", // file-loader加载图片，url-loader图片小于多少k用base64显示
                options: {
                    limit: 100 * 1024, // 小于100kb用base64
                    // build之后的目录分类
                    outputPath: "static/images"
                }
            }
        }
    ]
}
```

### 3. 在 index.js 里面使用

```js
var image = new Image(); // 要用var不要用let定义，因为uglifyjs(js压缩)不支持es6
// es5 写法
// image.src = require("./assets/images/1.jpg").default;
// es6 写法
import logo from './assets/images/2.jpg';
img.src = logo;
img.width = 300;
img.height = 200;
document.body.appendChild(image);
```

### 4. 补充超过`100kb`的图片

```shell
# file-laoder主要提供图片路径
npm install --save-dev file-loader
```

