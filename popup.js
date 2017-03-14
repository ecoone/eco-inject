
var MainLogic = {
  allLinks: [],
  freeLinkObjs: {},
  visibleLinks: [],
  injectLinks: [],
  errorFlag: false,
  $id: function (_id) { return document.getElementById(_id); },
  init: function () {
    document.addEventListener("DOMContentLoaded", MainLogic.domready, false);
  },

  //domready
  domready: function () {
    //检索关键字
    MainLogic.$id("filterValue").onkeyup = MainLogic.filterLinks;
    //恢复选中脚本
    MainLogic.$id("free").onclick = MainLogic.freeLinks;
    //下载阻塞js
    MainLogic.$id("save").onclick = MainLogic.downloadLinks;
    //手动脚本注入
    MainLogic.$id("injectScript").onclick = MainLogic.getScript;
    //注入的链接
    MainLogic.$id("injectValue").onblur = MainLogic.setInjectLinks;
    //执行抓取页面js方法
    chrome.tabs.executeScript(null, {
      file: "sendlink.js"
    });
  },

  //显示检索到的脚本
  showLinks: function (l) {
    var linksWrap = MainLogic.$id("linkList");
    linksWrap.innerHTML = "";
    for (var i = 0, n = l.length; i < n; i++) {
      var li = document.createElement("li");
      var checkbox = document.createElement("input");
      var span = document.createElement("span");
      span.id = 'sp' + i;
      if (MainLogic.freeLinkObjs[l[i]]) span.style.color = '#449d44';
      checkbox.checked = true;
      checkbox.type = "checkbox";
      checkbox.id = "cb" + i;
      span.innerText = l[i];
      span.title = l[i];
      li.appendChild(checkbox);
      li.appendChild(span);
      linksWrap.appendChild(li);
    }
    MainLogic.$id("jscount").innerText = l.length;
  },
  //下载所选链接
  downloadLinks: function () {
    for (var i = 0, n = MainLogic.visibleLinks.length; i < n; i++) {
      if (MainLogic.$id("cb" + i).checked) {
        chrome.downloads.download({ url: MainLogic.visibleLinks[i] });
      }
    }
    window.close();
  },
  freeLinks: function () {
    var freeLinks = [];
    for (var i = 0, n = MainLogic.visibleLinks.length; i < n; i++) {
      if (MainLogic.$id("cb" + i).checked) {
        freeLinks.push(MainLogic.visibleLinks[i]);
        MainLogic.freeLinkObjs[MainLogic.visibleLinks[i]] = true;
      }
    }
    var executeCode = MainLogic.generateCode(freeLinks);

    chrome.tabs.executeScript(null, { code: executeCode, allFrames: false }, function () {
      MainLogic.msgBox("脚本注入成功！");
      for (var i = 0, n = MainLogic.visibleLinks.length; i < n; i++) {
        if (MainLogic.$id("cb" + i).checked) {
          MainLogic.$id("sp" + i).style.color = '#449d44';
        }
      }
    });
  },
  //检索url
  filterLinks: function () {
    var filtervalue = MainLogic.$id("filterValue").value.trim();
    var visLinks = MainLogic.allLinks.filter(function (link) {
      return link.match(filtervalue);
    });
    MainLogic.showLinks(visLinks);
  },
  //获取远程脚本并进行普通注入
  getScript: function () {
    MainLogic.setInjectLinks();
    var injectLinks = MainLogic.injectLinks;
    var injectLinksCode = [injectLinks.length];
    var reloadCount = 0;
    if (!MainLogic.errorFlag && injectLinks.length > 0) {
      var executeCode = MainLogic.generateCode(MainLogic.injectLinks);
      chrome.tabs.executeScript(null, { code: executeCode, allFrames: false }, function () {
        MainLogic.msgBox("脚本注入成功！");
      });
    } else {
      MainLogic.msgBox("注入的脚本为空或者注入的链接错误");
    }
  },
  generateCode: function (injectLinks) {
    var code = 'var doc = document;var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;';
    [].forEach.call(injectLinks, function (url, i) {
      var u;
      var flag = '';
      if (i == 0) {
        flag = '_startecoi';
      }
      if (i == (injectLinks.length - 1)) {
        flag = '_endecoi';
      }
      u = url + '#_eco=ecoi' + flag;
      var addNodeCode = 'var node = doc.createElement("script");node.async = false;node.src = "' + u + '";head.appendChild(node);';
      code += addNodeCode;
    });
    return code;
  },
  //设置注入url
  setInjectLinks: function () {
    MainLogic.injectLinks = MainLogic.$id("injectValue").value.split("\n");
    MainLogic.errorFlag = false;
    [].forEach.call(MainLogic.injectLinks, function (href) {
      if (!/[http|https]:\/\//gi.test(href)) {
        MainLogic.errorFlag = true;
      }
    });
    if (MainLogic.errorFlag) {
      $("#injectValue").addClass('errbox');
    } else {
      $("#injectValue").removeClass('errbox');
    }
  },
  //弹出框
  msgBox: function (str) {
    var timer = null;
    $('#xhr-errbox').html(str)
    $('#xhr-errbox').show();
    timer = setTimeout(function () {
      $('#xhr-errbox').hide();
      clearTimeout(timer);
    }, 2000);
  }
};

//接受sendlink.js发送来的消息
chrome.extension.onMessage.addListener(function (links) {
  for (var index in links) {
    MainLogic.allLinks.push(links[index]);
  }
  MainLogic.allLinks.sort();
  MainLogic.visibleLinks = MainLogic.allLinks;
  MainLogic.showLinks(MainLogic.visibleLinks);
});

MainLogic.init();