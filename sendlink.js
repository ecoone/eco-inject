//获取页面中的script脚本，并发送给popup.js
var scriptLinks = document.getElementsByTagName("script");
	arr = [];
[].forEach.call(scriptLinks, function(el) {
	var href = el.src;
	if(/[http|https]:\/\//gi.test(href)){
		arr.push(href);
	}
});
arr.sort();
chrome.extension.sendMessage(arr);
