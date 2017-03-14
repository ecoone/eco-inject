#eco-inject页面脚本拦截注入工具
用于页面页面脚本拦截注入的chrome插件，不仅可以注入普通脚本，也可以注入ecojs，seajs，requirejs这样的动态加载的脚本。
##如何安装使用？
1. 打开`chrome://extensions/`
2. 本地调试的话，选择`加载已压缩的扩展程序...`
3. 需要打包的话，请选择`打包扩展程序...`
4. 选择eco-inject目录
5. 第二步中选择完成直接使用插件
6. 第三步选择完成点击`打包扩展程序`，就会在eco-inject同级目录生成`eco-inject.crx`和`eco-inject.pem`
7. 将`eco-inject.crx`拖入浏览器`chrome://extensions/`页面即可使用


##chrome插件相关资料
1. [360浏览器插件开发](http://open.chrome.360.cn/extension_dev/overview.html)
2. [Chrome扩展及应用开发Turing](http://www.ituring.com.cn/minibook/10702) 
3. [chrome-app-samples](https://github.com/GoogleChrome/chrome-app-samples)
