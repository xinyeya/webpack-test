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
	```shell
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