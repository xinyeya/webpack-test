import './assets/css/index/index.css'
var image = new Image();
// es5 写法
// image.src = require("./assets/images/1.jpg").default;

// es6 写法
import logo from './assets/images/2.jpg';
image.src = logo;
image.width = 300;
image.height = 200;
document.body.appendChild(image);