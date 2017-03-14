var tabsStatus = {}

//页面js拦截
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var url = details.url;
    var tabId = details.tabId;
    //注入脚本的时候开放一个6秒的窗口，来注入动态加载脚本的比如说ecojs，seajs,requirejs动态加载的脚本
    if (url.indexOf("_startecoi") != -1) {
      tabsStatus[tabId] = true;
    }
    if (tabsStatus[tabId]) return;
    return { redirectUrl: chrome.extension.getURL("returnjs.js") };
  },
  {
    urls: [
      "*://*/*"
    ],
    types: ["script"]
  },
  ["blocking"]
);

chrome.webRequest.onCompleted.addListener(
  function (details) {
    var url = details.url;
    var tabId = details.tabId;
    if (url.indexOf("_endecoi") != -1) {
      (function (tabId) {
        setTimeout(function () {
          tabsStatus[tabId] = false;
        }, 6000);
      })(tabId);
    }
  },
  {
    urls: [
      "*://*/*"
    ],
    types: ["script"]
  },
  ["responseHeaders"]
);

